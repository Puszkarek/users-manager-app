import { every, isString } from 'lodash';
import { isArray } from 'lodash-es';
import { CreatableUser, UpdatableUser, User } from '@front/interfaces';

export const isUser = (value: unknown): value is User => {
  try {
    const { id } = <User>value;

    return isString(id);
  } catch {
    return false;
  }
};

export const isUpdatableUser = (value: unknown): value is UpdatableUser => {
  try {
    const { id } = <UpdatableUser>value;

    return isString(id);
  } catch {
    return false;
  }
};

export const isCreatableUser = (value: unknown): value is CreatableUser => {
  try {
    const { password } = <CreatableUser>value;

    return isString(password);
  } catch {
    return false;
  }
};

// TODO: move to guards
export const isListOfUsers = (value: unknown): value is ReadonlyArray<User> => {
  try {
    const users = <ReadonlyArray<User>>value;
    return isArray(users) && every(users, (user) => isString(user.id));
  } catch {
    return false;
  }
};
