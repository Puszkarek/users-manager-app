import { randomUUID } from 'node:crypto';

import { AuthToken, CreatableUser, ID, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { createExceptionError } from '@server/infra/helpers';
import {
  ExceptionError,
  MailProvider,
  REQUEST_STATUS,
  UsersOperations,
  UsersRepository,
} from '@server/infra/interfaces';
import { Either, fromOption, isLeft, left, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { isNone, isSome } from 'fp-ts/lib/Option';

export class UsersService implements UsersOperations {
  public create = {
    /**
     * Create a new {@link User} and save on the repository, then send an message to his email
     * address
     *
     * @param data - The data for the {@link User} we wanna create
     * @returns On success it'll be the created {@link User}, otherwise the error that happened
     */
    one: async (data: CreatableUser): Promise<Either<ExceptionError, User>> => {
      const { password, ...creatableUser } = data;
      const userO = await this._usersRepository.findByEmail(creatableUser.email);

      if (isSome(userO)) {
        return left(createExceptionError('User already exists', REQUEST_STATUS.not_found));
      }

      const newUser: User = {
        ...data,
        id: randomUUID(),
      };

      await this._usersRepository.save(newUser, password);

      await this._mailProvider.sendMail({
        body: 'Welcome to App Team',
        from: {
          email: 'team@app.com',
          name: 'App Team',
        },
        subject: 'Registering to App Team',
        to: {
          email: data.email,
          name: data.name,
        },
      });

      return right(newUser);
    },
  };

  public delete = {
    /**
     * Delete one {@link User} from the repository
     *
     * @param id - The {@link User} to delete
     * @returns On success it'll be void, otherwise the error that happened
     */
    one: async (id: ID): Promise<Either<ExceptionError, void>> => {
      const either = await this._usersRepository.delete(id);
      return either;
    },
  };

  public get = {
    /**
     * Fetch all the users in the repository
     *
     * @returns List with the existing users
     */
    all: async (): Promise<Either<ExceptionError, ReadonlyArray<User>>> => {
      const either = await this._usersRepository.all();
      return either;
    },
    /**
     * Fetch one user from the repository by ID
     *
     * @param id - The {@link ID} from the {@link User} that we wanna find
     * @returns The user found, otherwise the error that happened
     */
    one: async (id: ID): Promise<Either<ExceptionError, User>> => {
      const userOption = await this._usersRepository.findByID(id);

      return pipe(
        userOption,
        fromOption(() => createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found)),
      );
    },

    /**
     * Fetch the repository to find the user with the given token
     *
     * @param token - The token to use to find the {@link User}
     * @returns The {@link User} that belongs to the token, otherwise the error that happened
     */
    me: async (token: AuthToken): Promise<Either<ExceptionError, User>> => {
      const userOption = await this._usersRepository.findByToken(token);

      return pipe(
        userOption,
        fromOption(() => createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found)),
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
    one: async (data: UpdatableUser): Promise<Either<ExceptionError, User>> => {
      const { password, ...updatableUser } = data;
      const userO = await this._usersRepository.findByID(updatableUser.id);
      if (isNone(userO)) {
        return left(createExceptionError('No user found with the given email', REQUEST_STATUS.not_found));
      }

      // TODO: validade the current password

      const updatedUser: User = { ...userO.value, ...updatableUser };
      const updateEither = await this._usersRepository.update(updatedUser, password);

      if (isLeft(updateEither)) {
        left(createExceptionError('Something gone wrong updating the user', REQUEST_STATUS.bad));
      }

      return right(updatedUser);
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
    one: async ({ email, password }: LoginRequest): Promise<Either<ExceptionError, LoginResponse>> => {
      // TODO: improve using pipe
      // Search the user using his email
      const userO = await this._usersRepository.findByEmail(email);
      if (isNone(userO)) {
        return left(createExceptionError('No user found with the given Email', REQUEST_STATUS.not_found));
      }

      // Validate the password
      const isPasswordValid = await this._usersRepository.isUserPasswordValid(userO.value.id, password);
      if (!isPasswordValid) {
        return left(createExceptionError('Check your password and try again', REQUEST_STATUS.bad));
      }

      // Create the Token
      const tokenE = await this._usersRepository.generateToken(userO.value.id);
      if (isLeft(tokenE)) {
        return tokenE;
      }

      return right({
        loggedUser: userO.value,
        token: tokenE.right,
      });
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
    refresh: async (token: AuthToken): Promise<Either<ExceptionError, LoginResponse>> => {
      // TODO: improve using pipe
      // Search the user using his email
      const userO = await this._usersRepository.findByToken(token);
      if (isNone(userO)) {
        return left(createExceptionError('No user found with the given Email', REQUEST_STATUS.not_found));
      }

      // Validate the password
      const isTokenValid = await this._usersRepository.isAuthTokenValid(token);
      if (!isTokenValid) {
        return left(createExceptionError('Check your password and try again', REQUEST_STATUS.bad));
      }

      // Create the Token
      const tokenE = await this._usersRepository.generateToken(token);
      if (isLeft(tokenE)) {
        return tokenE;
      }
      return right({
        loggedUser: userO.value,
        token: tokenE.right,
      });
    },
    /**
     * Check if the given token is valid
     *
     * @param token - The token to check
     * @returns On success it'll be void, otherwise the error that happened
     */
    validate: async (token: AuthToken): Promise<Either<ExceptionError, void>> => {
      const isValid = await this._usersRepository.isAuthTokenValid(token);

      if (!isValid) {
        return left(createExceptionError('The given token is invalid', REQUEST_STATUS.unauthorized));
      }

      return right(void 0);
    },
  };

  constructor(private readonly _usersRepository: UsersRepository, private readonly _mailProvider: MailProvider) {}
}
