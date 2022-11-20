import { User } from '@api-interfaces';

import { generateUser } from '../../tests/generators';

export const loggedUser = generateUser({ name: 'Bob' });

export const mockedUsers: ReadonlyArray<User> = [
  loggedUser,
  generateUser({ name: 'Will' }),
  generateUser({ name: 'Steve' }),
];
