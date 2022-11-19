import { nanoid } from 'nanoid';
import { CreatableUser, User, USER_ROLE } from '@front/interfaces';

export const generateUser = ({ name, email, role }: Partial<CreatableUser>): User => ({
  email: email ?? (name ? `${name.toLowerCase()}@${name.toLowerCase()}` : 'bob@bob'),
  id: nanoid(),
  name: name ?? 'Bob',
  role: role ?? USER_ROLE.admin,
});
