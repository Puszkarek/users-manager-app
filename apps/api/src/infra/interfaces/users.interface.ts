import { AuthToken, CreatableUser, ID, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/lib/Option';

import { ExceptionError } from './error.interface';

/** An abstract interface that all our users repository should follow */
export type IUsersRepository = {
  readonly findByEmail: (email: string) => Promise<Option<User>>;
  readonly findByToken: (token: AuthToken) => Promise<Option<User>>;
  readonly findByID: (id: string) => Promise<Option<User>>;

  // TODO: rename these methods to specify that we are doing actions in the user
  readonly save: (user: User, password: string) => Promise<Either<ExceptionError, void>>;
  readonly update: (user: User, password?: string) => Promise<Either<ExceptionError, void>>;
  readonly delete: (userID: ID) => Promise<Either<ExceptionError, void>>;

  readonly all: () => Promise<Either<ExceptionError, ReadonlyArray<User>>>;

  readonly isUserPasswordValid: (email: string, password: string) => Promise<boolean>;
  readonly isAuthTokenValid: (token: AuthToken) => Promise<boolean>;

  readonly addToken: (user: User['id']) => Promise<Either<ExceptionError, AuthToken>>;
};

/** An abstract interface that all our users handler should follow */
export type IUsersService = {
  readonly create: {
    readonly one: (data: CreatableUser) => Promise<Either<ExceptionError, User>>;
  };
  readonly delete: {
    readonly one: (data: ID) => Promise<Either<ExceptionError, void>>;
  };
  readonly update: {
    readonly one: (data: UpdatableUser) => Promise<Either<ExceptionError, User>>;
  };
  readonly get: {
    readonly one: (data: ID) => Promise<Either<ExceptionError, User>>;
    readonly me: (data: AuthToken) => Promise<Either<ExceptionError, User>>;
    readonly all: () => Promise<Either<ExceptionError, ReadonlyArray<User>>>;
  };
  /** Create a token for the current logged user */
  readonly login: {
    readonly one: (data: LoginRequest) => Promise<Either<ExceptionError, LoginResponse>>;
  };

  /** Update a token for the user */
  readonly token: {
    readonly validate: (data: AuthToken) => Promise<Either<ExceptionError, void>>;
    readonly refresh: (data: AuthToken) => Promise<Either<ExceptionError, LoginResponse>>;
  };

  // TODO: logout
};
