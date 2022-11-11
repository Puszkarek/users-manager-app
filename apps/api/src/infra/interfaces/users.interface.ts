import { CreatableUser, ID, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/lib/Option';

import { ExceptionError } from './error.interface';

export type IUsersRepository = {
  readonly findByEmail: (email: string) => Promise<Option<User>>;
  readonly findByID: (id: string) => Promise<Option<User>>;

  readonly save: (user: User, password: string) => Promise<Either<ExceptionError, void>>;
  readonly update: (user: User, password?: string) => Promise<Either<ExceptionError, void>>;
  readonly delete: (userID: ID) => Promise<Either<ExceptionError, void>>;

  readonly all: () => Promise<Either<ExceptionError, ReadonlyArray<User>>>;

  readonly isUserPasswordValid: (email: string, password: string) => Promise<Either<ExceptionError, boolean>>;
};

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
    readonly all: () => Promise<Either<ExceptionError, ReadonlyArray<User>>>;
  };
  /** Create a token for the current logged user */
  readonly login: {
    readonly one: (data: {
      readonly email: string;
      readonly password: string;
    }) => Promise<Either<ExceptionError, LoginResponse>>;
  };

  // TODO: logout
};
