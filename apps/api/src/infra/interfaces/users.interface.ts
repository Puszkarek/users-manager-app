import { AuthToken, CreatableUser, ID, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { Task } from 'fp-ts/lib/Task';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { TaskOption } from 'fp-ts/lib/TaskOption';

import { ExceptionError } from './error.interface';

/** An abstract interface that all our users repository should follow */
export type UsersRepository = {
  readonly findByEmail: (email: string) => TaskOption<User>;
  readonly findByID: (id: string) => TaskOption<User>;

  readonly save: (user: User, password: string) => TaskEither<ExceptionError, User>;
  readonly update: (user: User, password?: string) => TaskEither<ExceptionError, User>;
  readonly delete: (userID: ID) => TaskEither<ExceptionError, void>;

  readonly all: () => TaskEither<ExceptionError, ReadonlyArray<User>>;

  readonly isUserPasswordValid: (email: string, password: string) => Task<boolean>;
  readonly isEmailAvailable: (email: string) => Task<boolean>;
};

/** An abstract interface that all our users handler should follow */
export type UsersService = {
  readonly create: {
    readonly one: (data: CreatableUser) => TaskEither<ExceptionError, User>;
  };
  readonly delete: {
    readonly one: (data: {
      readonly idToDelete: ID;
      readonly currentUserToken: AuthToken;
    }) => TaskEither<ExceptionError, void>;
  };
  readonly update: {
    readonly one: (data: UpdatableUser) => TaskEither<ExceptionError, User>;
  };
  readonly get: {
    readonly one: (data: ID) => TaskEither<ExceptionError, User>;
    readonly me: (data: AuthToken) => TaskEither<ExceptionError, User>;
    readonly all: () => TaskEither<ExceptionError, ReadonlyArray<User>>;
  };
  /** Create a token for the current logged user */
  readonly login: {
    readonly one: (data: LoginRequest) => TaskEither<ExceptionError, LoginResponse>;
  };

  /** Update a token for the user */
  readonly token: {
    readonly validate: (data: AuthToken) => TaskEither<ExceptionError, void>;
    readonly refresh: (data: AuthToken) => TaskEither<ExceptionError, LoginResponse>;
  };

  // TODO: logout
};

export type FindByToken = (token: AuthToken) => TaskOption<User>;
