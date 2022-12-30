import { randomUUID } from 'node:crypto';

import { AuthToken, CreatableUser, ID, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { createExceptionError } from '@server/infra/helpers/error';
import { generateToken, parseToken } from '@server/infra/helpers/token';
import { ExceptionError, FindByToken, REQUEST_STATUS, UsersRepository } from '@server/infra/interfaces';
import { MailProvider } from '@server/infra/interfaces/mail.interface';
import { boolean as B, task as T, taskEither as TE, taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';

/**
 * Create a new {@link User} and save on the repository, then send an message to his email
 * address
 *
 * @param data - The data for the {@link User} we wanna create
 * @returns On success it'll be the created {@link User}, otherwise the error that happened
 */
export const makeCreateOne =
  (usersRepository: UsersRepository, mailProvider: MailProvider) =>
  ({ password, ...creatableUserData }: CreatableUser): TaskEither<ExceptionError, User> => {
    // Generate the new user
    const newUser: User = {
      ...creatableUserData,
      id: randomUUID(),
    };

    // TODO: may can be a helper
    const currentUserAlreadyExists: TaskEither<ExceptionError, void> = pipe(
      // * Get the user with the given email
      creatableUserData.email,
      usersRepository.findByEmail,
      // * Return `null` if `Some`
      TO.match(
        // TODO: improve that
        // None: The user doesn't exists, we can create a new user
        () => true,
        // Some: The user already exists, so we don't wanna keep the creation process
        () => null,
      ),
      TE.fromNullable(createExceptionError('User already exists', REQUEST_STATUS.not_found)),
      TE.map(() => void 0),
    );

    return pipe(
      // * Check that the user doesn't exists yet
      currentUserAlreadyExists,
      // * Save the new `User` on the repository
      TE.chain(() => usersRepository.save(newUser, password)),
      // * Send the confirmation email to the user
      TE.chain(() =>
        mailProvider.sendMail({
          body: 'Welcome to App Team',
          from: {
            email: 'team@app.com',
            name: 'App Team',
          },
          subject: 'Registering to App Team',
          to: {
            email: creatableUserData.email,
            name: creatableUserData.name,
          },
        }),
      ),
      TE.map(() => newUser),
    );
  };

/**
 * Update an existing {@link User} and save on the repository
 *
 * @param data - The data from the {@link User} that we wanna update
 * @returns On success it'll be the updated {@link User}, otherwise the error that happened
 */
export const makeUpdateOne =
  (usersRepository: UsersRepository) =>
  ({ password, ...updatableUser }: UpdatableUser): TaskEither<ExceptionError, User> => {
    return pipe(
      updatableUser.id,
      usersRepository.findByID,
      TE.fromTaskOption(() => createExceptionError('No user found with the given email', REQUEST_STATUS.not_found)),
      // TODO: validade the current password
      TE.map(currentUser => ({ ...currentUser, ...updatableUser })),
      TE.chain(updatedUser =>
        pipe(
          usersRepository.update(updatedUser, password),
          TE.map(() => updatableUser as User),
        ),
      ),
    );
  };

/**
 * Delete one {@link User} from the repository
 *
 * @param id - The {@link User} to delete
 * @returns On success it'll be void, otherwise the error that happened
 */
export const makeDeleteOne =
  (usersRepository: UsersRepository, findByToken: FindByToken) =>
  ({
    idToDelete,
    currentUserToken,
  }: {
    readonly idToDelete: ID;
    readonly currentUserToken: AuthToken;
  }): TaskEither<ExceptionError, void> => {
    return pipe(
      // * Check if the user don't wanna delete himself
      currentUserToken,
      findByToken,
      // Convert to an `Either`
      TE.fromTaskOption(() => createExceptionError('None use with the given ID to delete', REQUEST_STATUS.bad)),
      // * Delete the user
      TE.chain(() => usersRepository.delete(idToDelete)),
    );
  };

/**
 * Fetch one user from the repository by ID
 *
 * @param id - The {@link ID} from the {@link User} that we wanna find
 * @returns The user found, otherwise the error that happened
 */
export const makeGetOne =
  (usersRepository: UsersRepository) =>
  (id: ID): TaskEither<ExceptionError, User> => {
    return pipe(
      usersRepository.findByID(id),
      TE.fromTaskOption(() => createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found)),
    );
  };

/**
 * Fetch the repository to find the user with the given token
 *
 * @param token - The token to use to find the {@link User}
 * @returns The {@link User} that belongs to the token, otherwise the error that happened
 */
export const makeGetMe =
  (findByToken: FindByToken) =>
  (token: AuthToken): TaskEither<ExceptionError, User> => {
    return pipe(
      // * Try to find the user by token
      token,
      findByToken,
      TE.fromTaskOption(() => createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found)),
    );
  };

export const makeGetAll = (usersRepository: UsersRepository) => (): TaskEither<ExceptionError, ReadonlyArray<User>> => {
  return usersRepository.all();
};

/**
 * Validate the login information and generate a new token for the user
 *
 * @param param - The info that we need to validate the login
 * @returns A {@link LoginResponse} with the token and the user that it belongs, otherwise the
 *   error that happens
 */
export const makeLoginMe =
  (usersRepository: UsersRepository) =>
  ({ email, password }: LoginRequest): TaskEither<ExceptionError, LoginResponse> => {
    const userTaskEither: TaskEither<ExceptionError, User> = pipe(
      email,
      usersRepository.findByEmail,
      TE.fromTaskOption(() => createExceptionError('No user found with the given Email', REQUEST_STATUS.not_found)),
    );

    const filterValidUser = (user: User): TaskEither<ExceptionError, User> =>
      pipe(
        usersRepository.isUserPasswordValid(user.id, password),
        T.chain(
          B.fold(
            // False
            () => TE.left(createExceptionError('Check your password and try again', REQUEST_STATUS.bad)),
            // Some
            () => TE.right(user),
          ),
        ),
      );

    return pipe(
      // * Search the user using the given email
      userTaskEither,
      // * Validate the password
      TE.bind('loggedUser', filterValidUser),
      // * Create the token
      TE.bind('token', user => generateToken(user.id)),

      TE.map(({ loggedUser, token }) => ({ loggedUser, token })),
    );
  };

/**
 * Generate a new token using the old one as base
 *
 * In case the token has expired it'll fails
 *
 * @param token - The old token to get the info
 * @returns A new Token, otherwise the error that happened
 */
export const makeRefreshToken =
  (findByToken: FindByToken) =>
  (rawToken: AuthToken): TaskEither<ExceptionError, LoginResponse> => {
    return pipe(
      // Search by the user using his token
      rawToken,
      // * Parse the token to see if it's valid
      parseToken,
      // * Get the user from token
      TE.chain(() =>
        // TODO: improve that
        pipe(
          rawToken,
          findByToken,
          TE.fromTaskOption(() => createExceptionError('No user found with the given Email', REQUEST_STATUS.not_found)),
        ),
      ),
      // * Generate the new token
      TE.chain(user =>
        // TODO: improve that
        pipe(
          user.id,
          generateToken,
          TE.map(token => ({
            loggedUser: user,
            token,
          })),
        ),
      ),
    );
  };

/**
 * Check if the given token is valid
 *
 * @param token - The token to check
 * @returns On success it'll be void, otherwise the error that happened
 */
export const makeValidateToken =
  () =>
  // eslint-disable-next-line unicorn/consistent-function-scoping
  (token: AuthToken): TaskEither<ExceptionError, void> => {
    return pipe(
      // * Parse the token
      token,
      parseToken,
      // Map the `Right` value to `void`
      TE.chain(() => TE.of(void 0)),
    );
  };
