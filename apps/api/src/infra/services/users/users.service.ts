import { randomUUID } from 'node:crypto';

import { AuthToken, CreatableUser, ID, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { createExceptionError } from '@server/infra/helpers/error';
import {
  ExceptionError,
  MailProvider,
  REQUEST_STATUS,
  UsersOperations,
  UsersRepository,
} from '@server/infra/interfaces';
import { boolean, task, taskEither, taskOption } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';

export class UsersService implements UsersOperations {
  public create = {
    /**
     * Create a new {@link User} and save on the repository, then send an message to his email
     * address
     *
     * @param data - The data for the {@link User} we wanna create
     * @returns On success it'll be the created {@link User}, otherwise the error that happened
     */
    one: ({ password, ...creatableUserData }: CreatableUser): TaskEither<ExceptionError, User> => {
      // Generate the new user
      const newUser: User = {
        ...creatableUserData,
        id: randomUUID(),
      };

      // TODO: may can be a helper
      const currentUserAlreadyExists: TaskEither<ExceptionError, void> = pipe(
        // * Get the user with the given email
        creatableUserData.email,
        this._usersRepository.findByEmail,
        // * Return `null` if `Some`
        taskOption.match(
          // TODO: improve that
          // None: The user doesn't exists, we can create a new user
          () => true,
          // Some: The user already exists, so we don't wanna keep the creation process
          () => null,
        ),
        taskEither.fromNullable(createExceptionError('User already exists', REQUEST_STATUS.not_found)),
        taskEither.map(() => void 0),
      );

      return pipe(
        // * Check that the user doesn't exists yet
        currentUserAlreadyExists,
        // * Save the new `User` on the repository
        taskEither.chain(() => this._usersRepository.save(newUser, password)),
        // * Send the confirmation email to the user
        taskEither.chain(() =>
          this._mailProvider.sendMail({
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
        taskEither.map(() => newUser),
      );
    },
  };

  public update = {
    /**
     * Update an existing {@link User} and save on the repository
     *
     * @param data - The data from the {@link User} that we wanna update
     * @returns On success it'll be the updated {@link User}, otherwise the error that happened
     */
    one: ({ password, ...updatableUser }: UpdatableUser): TaskEither<ExceptionError, User> => {
      return pipe(
        updatableUser.id,
        this._usersRepository.findByID,
        taskEither.fromTaskOption(() =>
          createExceptionError('No user found with the given email', REQUEST_STATUS.not_found),
        ),
        // TODO: validade the current password
        taskEither.map(currentUser => ({ ...currentUser, ...updatableUser })),
        taskEither.chain(updatedUser =>
          pipe(
            this._usersRepository.update(updatedUser, password),
            taskEither.map(() => updatableUser as User),
          ),
        ),
      );
    },
  };

  public delete = {
    /**
     * Delete one {@link User} from the repository
     *
     * @param id - The {@link User} to delete
     * @returns On success it'll be void, otherwise the error that happened
     */
    one: ({
      idToDelete,
      currentUserToken,
    }: {
      readonly idToDelete: ID;
      readonly currentUserToken: AuthToken;
    }): TaskEither<ExceptionError, void> => {
      return pipe(
        // * Check if the user don't wanna delete himself
        currentUserToken,
        this._usersRepository.findByToken,
        // Convert to an `Either`
        taskEither.fromTaskOption(() =>
          createExceptionError('None use with the given ID to delete', REQUEST_STATUS.bad),
        ),
        // * Delete the user
        taskEither.chain(() => this._usersRepository.delete(idToDelete)),
      );
    },
  };

  public get = {
    /**
     * Fetch all the users in the repository
     *
     * @returns List with the existing users
     */
    all: (): TaskEither<ExceptionError, ReadonlyArray<User>> => {
      return this._usersRepository.all();
    },
    /**
     * Fetch one user from the repository by ID
     *
     * @param id - The {@link ID} from the {@link User} that we wanna find
     * @returns The user found, otherwise the error that happened
     */
    one: (id: ID): TaskEither<ExceptionError, User> => {
      return pipe(
        this._usersRepository.findByID(id),
        taskEither.fromTaskOption(() =>
          createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found),
        ),
      );
    },

    /**
     * Fetch the repository to find the user with the given token
     *
     * @param token - The token to use to find the {@link User}
     * @returns The {@link User} that belongs to the token, otherwise the error that happened
     */
    me: (token: AuthToken): TaskEither<ExceptionError, User> => {
      return pipe(
        // * Try to find the user by token
        token,
        this._usersRepository.findByToken,
        taskEither.fromTaskOption(() =>
          createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found),
        ),
      );
    },
  };

  public login = {
    /**
     * Validate the login information and generate a new token for the user
     *
     * @param param - The info that we need to validate the login
     * @returns A {@link LoginResponse} with the token and the user that it belongs, otherwise
     *   the error that happens
     */
    one: ({ email, password }: LoginRequest): TaskEither<ExceptionError, LoginResponse> => {
      const userTaskEither: TaskEither<ExceptionError, User> = pipe(
        email,
        this._usersRepository.findByEmail,
        taskEither.fromTaskOption(() =>
          createExceptionError('No user found with the given Email', REQUEST_STATUS.not_found),
        ),
      );

      const filterValidUser = (user: User): TaskEither<ExceptionError, User> =>
        pipe(
          this._usersRepository.isUserPasswordValid(user.id, password),
          task.chain(
            boolean.fold(
              // False
              () => taskEither.left(createExceptionError('Check your password and try again', REQUEST_STATUS.bad)),
              // Some
              () => taskEither.right(user),
            ),
          ),
        );

      return pipe(
        // * Search the user using the given email
        userTaskEither,
        // * Validate the password
        taskEither.bind('loggedUser', filterValidUser),
        // * Create the token
        taskEither.bind('token', user => this._usersRepository.generateToken(user.id)),

        taskEither.map(({ loggedUser, token }) => ({ loggedUser, token })),
      );
    },
  };

  public readonly token = {
    /**
     * Generate a new token using the old one as base
     *
     * In case the token has expired it'll fails
     *
     * @param token - The old token to get the info
     * @returns A new Token, otherwise the error that happened
     */
    refresh: (rawToken: AuthToken): TaskEither<ExceptionError, LoginResponse> => {
      return pipe(
        // Search by the user using his token
        rawToken,
        // * Parse the token to see if it's valid
        this._usersRepository.parseToken,
        // * Get the user from token
        taskEither.chain(() =>
          // TODO: improve that
          pipe(
            rawToken,
            this._usersRepository.findByToken,
            taskEither.fromTaskOption(() =>
              createExceptionError('No user found with the given Email', REQUEST_STATUS.not_found),
            ),
          ),
        ),
        // * Generate the new token
        taskEither.chain(user =>
          // TODO: improve that
          pipe(
            user.id,
            this._usersRepository.generateToken,
            taskEither.map(token => ({
              loggedUser: user,
              token,
            })),
          ),
        ),
      );
    },
    /**
     * Check if the given token is valid
     *
     * @param token - The token to check
     * @returns On success it'll be void, otherwise the error that happened
     */
    validate: (token: AuthToken): TaskEither<ExceptionError, void> => {
      return pipe(
        // * Parse the token
        token,
        this._usersRepository.parseToken,
        // Map the `Right` value to `void`
        taskEither.chain(() => taskEither.of(void 0)),
      );
    },
  };

  constructor(private readonly _usersRepository: UsersRepository, private readonly _mailProvider: MailProvider) {}
}
