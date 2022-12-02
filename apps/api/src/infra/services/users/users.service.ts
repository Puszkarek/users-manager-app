import { randomUUID } from 'node:crypto';

import { AuthToken, CreatableUser, ID, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { createExceptionError } from '@server/infra/helpers';
import {
  ExceptionError,
  IMailProvider,
  IUsersRepository,
  IUsersService,
  REQUEST_STATUS,
} from '@server/infra/interfaces';
import { Either, fromOption, isLeft, left, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { isNone, isSome } from 'fp-ts/lib/Option';

// TODO: remove try catch from here
export class UsersService implements IUsersService {
  public create = {
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
    one: async (id: ID): Promise<Either<ExceptionError, void>> => {
      const either = await this._usersRepository.delete(id);
      return either;
    },
  };

  public get = {
    all: async (): Promise<Either<ExceptionError, ReadonlyArray<User>>> => {
      const either = await this._usersRepository.all();
      return either;
    },
    one: async (id: ID): Promise<Either<ExceptionError, User>> => {
      const userOption = await this._usersRepository.findByID(id);

      return pipe(
        userOption,
        fromOption(() => createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found)),
      );
    },
    me: async (token: AuthToken): Promise<Either<ExceptionError, User>> => {
      const userOption = await this._usersRepository.findByToken(token);

      return pipe(
        userOption,
        fromOption(() => createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found)),
      );
    },
  };

  public update = {
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
      const tokenE = await this._usersRepository.addToken(userO.value.id);
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
      const tokenE = await this._usersRepository.addToken(token);
      if (isLeft(tokenE)) {
        return tokenE;
      }
      return right({
        loggedUser: userO.value,
        token: tokenE.right,
      });
    },
    validate: async (token: AuthToken): Promise<Either<ExceptionError, void>> => {
      const isValid = await this._usersRepository.isAuthTokenValid(token);

      if (!isValid) {
        return left(createExceptionError('The given token is invalid', REQUEST_STATUS.unauthorized));
      }

      return right(void 0);
    },
  };

  constructor(private readonly _usersRepository: IUsersRepository, private readonly _mailProvider: IMailProvider) {}
}
