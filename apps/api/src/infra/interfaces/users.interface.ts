import { CreatableUser, ID, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { Either } from 'fp-ts/lib/Either';

export type IUsersRepository = {
  readonly findByEmail: (email: string) => Promise<User | null>;
  readonly findByID: (id: string) => Promise<User | null>;

  readonly save: (user: User, password: string) => Promise<void>;
  readonly update: (user: User, password?: string) => Promise<void>;
  readonly delete: (userID: ID) => Promise<void>;

  readonly all: () => Promise<ReadonlyArray<User>>;

  readonly isUserPasswordValid: (email: string, password: string) => Promise<boolean>;
};

export type IUsersService = {
  readonly create: {
    readonly one: (data: CreatableUser) => Promise<Either<Error, User>>;
  };
  readonly delete: {
    readonly one: (data: ID) => Promise<Either<Error, void>>;
  };
  readonly update: {
    readonly one: (data: UpdatableUser) => Promise<Either<Error, void>>;
  };
  readonly get: {
    readonly one: (data: ID) => Promise<Either<Error, User>>;
    readonly all: () => Promise<Either<Error, ReadonlyArray<User>>>;
  };
  /** Create a token for the current logged user */
  readonly login: {
    readonly one: (data: {
      readonly email: string;
      readonly password: string;
    }) => Promise<Either<Error, LoginResponse>>;
  };
  // TODO: logout
};
