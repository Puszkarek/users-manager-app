import { every, isArray, isString } from 'lodash';

import { CreatableUser, LoginRequest, UpdatableUser, User } from '../entities/user.entity';

export const isUser = (value: unknown): value is User => {
  try {
    const { id } = value as User;

    return isString(id);
  } catch {
    return false;
  }
};

export const isUpdatableUser = (value: unknown): value is UpdatableUser => {
  try {
    const { id } = value as UpdatableUser;

    return isString(id);
  } catch {
    return false;
  }
};

export const isCreatableUser = (value: unknown): value is CreatableUser => {
  try {
    const { password } = value as CreatableUser;

    return isString(password);
  } catch {
    return false;
  }
};

export const isListOfUsers = (value: unknown): value is ReadonlyArray<User> => {
  try {
    const users = value as ReadonlyArray<User>;
    return isArray(users) && every(users, user => isString(user.id));
  } catch {
    return false;
  }
};

export const isLoginRequest = (value: unknown): value is LoginRequest => {
  try {
    const request = value as LoginRequest;

    return isString(request.email) && isString(request.password);
  } catch {
    return false;
  }
};
