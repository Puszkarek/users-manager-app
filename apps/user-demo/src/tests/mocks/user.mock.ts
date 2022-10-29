import { User } from '@front/interfaces';
import { generateUser } from 'src/tests/generators';

export const loggedUser = generateUser({ name: 'Bob' });

export const mockedUsers: Array<User> = [
  loggedUser,
  generateUser({ name: 'Will' }),
  generateUser({ name: 'Steve' }),
];
