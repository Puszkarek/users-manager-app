import { ID } from '../interfaces';

export enum USER_ROLE {
  admin = 'admin',
  manager = 'manager',
  employee = 'employee',
}

export type User = {
  readonly id: ID;
  readonly name: string;
  readonly email: string;
  readonly role: USER_ROLE;
};

export type UpdatableUser = {
  readonly id: ID;
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;
  readonly role?: USER_ROLE;
};

export type CreatableUser = {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: USER_ROLE;
};

// TODO: rename to AuthToken
export type AuthToken = string;
export type AuthTokenMetadata = {
  readonly expireAt: Date;
  readonly userID: string;
};

export type LoginRequest = {
  readonly email: string;
  readonly password: string;
};

export type LoginResponse = {
  readonly loggedUser: User;
  readonly token: AuthToken;
};
