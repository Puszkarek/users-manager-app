import { AuthToken, CreatableUser, ID, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/lib/Option';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { TaskOption } from 'fp-ts/lib/TaskOption';
import * as jose from 'jose';

import { ExceptionError } from './error.interface';

/** An abstract interface that all our users repository should follow */
export type UsersRepository = {
  readonly findByEmail: (email: string) => Promise<Option<User>>;
  readonly findByToken: (token: AuthToken) => TaskOption<User>;
  readonly findByID: (id: string) => Promise<Option<User>>;

  readonly save: (user: User, password: string) => Promise<Either<ExceptionError, void>>;
  readonly update: (user: User, password?: string) => Promise<Either<ExceptionError, void>>;
  readonly delete: (userID: ID) => TaskEither<ExceptionError, void>;

  readonly all: () => Promise<Either<ExceptionError, ReadonlyArray<User>>>;

  readonly isUserPasswordValid: (email: string, password: string) => Promise<boolean>;

  // TODO: may need to move to their own repository
  readonly parseToken: (rawToken: string) => TaskEither<ExceptionError, jose.JWTVerifyResult>;
  readonly generateToken: (userID: User['id']) => TaskEither<ExceptionError, AuthToken>;
};

/** An abstract interface that all our users handler should follow */
export type UsersOperations = {
  readonly create: {
    readonly one: (data: CreatableUser) => Promise<Either<ExceptionError, User>>;
  };
  readonly delete: {
    readonly one: (data: {
      readonly idToDelete: ID;
      readonly currentUserToken: AuthToken;
    }) => TaskEither<ExceptionError, void>;
  };
  readonly update: {
    readonly one: (data: UpdatableUser) => Promise<Either<ExceptionError, User>>;
  };
  readonly get: {
    readonly one: (data: ID) => Promise<Either<ExceptionError, User>>;
    readonly me: (data: AuthToken) => TaskEither<ExceptionError, User>;
    readonly all: () => Promise<Either<ExceptionError, ReadonlyArray<User>>>;
  };
  /** Create a token for the current logged user */
  readonly login: {
    readonly one: (data: LoginRequest) => Promise<Either<ExceptionError, LoginResponse>>;
  };

  /** Update a token for the user */
  readonly token: {
    readonly validate: (data: AuthToken) => TaskEither<ExceptionError, void>;
    readonly refresh: (data: AuthToken) => TaskEither<ExceptionError, LoginResponse>;
  };

  // TODO: logout
};
