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
import { TokenService } from '@server/infra/services/token';
import { boolean as B, task as T, taskEither as TE, taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { TaskOption } from 'fp-ts/lib/TaskOption';
import { isString } from 'lodash';

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
        TE.chain(() => this._usersRepository.save(newUser, password)),
        // * Send the confirmation email to the user
        TE.chain(() =>
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
        TE.map(() => newUser),
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
        TE.fromTaskOption(() => createExceptionError('No user found with the given email', REQUEST_STATUS.not_found)),
        // TODO: validade the current password
        TE.map(currentUser => ({ ...currentUser, ...updatableUser })),
        TE.chain(updatedUser =>
          pipe(
            this._usersRepository.update(updatedUser, password),
            TE.map(() => updatableUser as User),
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
        this._findByToken,
        // Convert to an `Either`
        TE.fromTaskOption(() => createExceptionError('None use with the given ID to delete', REQUEST_STATUS.bad)),
        // * Delete the user
        TE.chain(() => this._usersRepository.delete(idToDelete)),
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
        TE.fromTaskOption(() => createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found)),
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
        this._findByToken,
        TE.fromTaskOption(() => createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found)),
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
        TE.fromTaskOption(() => createExceptionError('No user found with the given Email', REQUEST_STATUS.not_found)),
      );

      const filterValidUser = (user: User): TaskEither<ExceptionError, User> =>
        pipe(
          this._usersRepository.isUserPasswordValid(user.id, password),
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
        TE.bind('token', user => this._tokenService.generateToken(user.id)),

        TE.map(({ loggedUser, token }) => ({ loggedUser, token })),
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
        this._tokenService.parseToken,
        // * Get the user from token
        TE.chain(() =>
          // TODO: improve that
          pipe(
            rawToken,
            this._findByToken,
            TE.fromTaskOption(() =>
              createExceptionError('No user found with the given Email', REQUEST_STATUS.not_found),
            ),
          ),
        ),
        // * Generate the new token
        TE.chain(user =>
          // TODO: improve that
          pipe(
            user.id,
            this._tokenService.generateToken,
            TE.map(token => ({
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
        this._tokenService.parseToken,
        // Map the `Right` value to `void`
        TE.chain(() => TE.of(void 0)),
      );
    },
  };

  constructor(
    private readonly _usersRepository: UsersRepository,
    private readonly _tokenService: TokenService,
    private readonly _mailProvider: MailProvider,
  ) {}

  /**
   * Parse the given token and try to find an {@link User} with that
   *
   * @param token - The token that belongs to the user
   * @returns An {@link Option} containing the found `User` or nothing
   */
  private readonly _findByToken = (token: AuthToken): TaskOption<User> => {
    return pipe(
      // * Parse the token
      token,
      this._tokenService.parseToken,
      TO.fromTaskEither,
      // * Extract the `userID` from payload
      TO.chain(({ payload: { userID } }) => TO.fromNullable(isString(userID) ? userID : null)), // TODO: improve validation
      // * Try to find the user
      TO.chain(this._usersRepository.findByID),
    );
  };
}
