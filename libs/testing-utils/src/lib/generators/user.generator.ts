import { CreatableUser, User, USER_ROLE } from '@api-interfaces';
import { nanoid } from 'nanoid';

export const generateUser = ({ id, name, email, role }: Partial<User>): User => ({
  email: email ?? (name ? `${name.toLowerCase()}@${name.toLowerCase()}` : 'bob@bob'),
  id: id ?? nanoid(),
  name: name ?? 'Bob',
  role: role ?? USER_ROLE.admin,
});

export const generateCreatableUser = ({ password, name, email, role }: Partial<CreatableUser>): CreatableUser => ({
  email: email ?? (name ? `${name.toLowerCase()}@${name.toLowerCase()}` : 'bob@bob'),
  name: name ?? 'Bob',
  role: role ?? USER_ROLE.admin,
  password: password ?? 'bob',
});
