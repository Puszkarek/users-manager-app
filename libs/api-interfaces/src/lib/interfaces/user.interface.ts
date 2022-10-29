export enum USER_ROLE {
  admin = 'admin',
  manager = 'manager',
  employee = 'employee',
}

export type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: USER_ROLE;
};

export type UpdatableUser = {
  readonly id: string;
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

export type UserToken = string;

export type LoginResponse = {
  readonly loggedUser: User;
  readonly token: UserToken;
};
