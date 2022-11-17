import { ID, User, USER_ROLE } from '@api-interfaces';
import { IUsersRepository } from '@server/infra/interfaces';
import { Either, left, right } from 'fp-ts/lib/Either';
import { fromNullable, Option } from 'fp-ts/lib/Option';
import { List, Map } from 'immutable';
import { isUndefined, uniqueId } from 'lodash';

import { createExceptionError } from '../../helpers/error.helper';
import { ExceptionError, REQUEST_STATUS } from '../../interfaces/error.interface';

/** The system should initialize with a default user */
const initialUser: User = {
  email: 'admin@admin',
  id: uniqueId(),
  name: 'Admin',
  role: USER_ROLE.admin,
};
const initialPassword = { [initialUser.id]: 'admin' };

/**
 * This is a demo repository for testing
 */
export class FakeUsersRepository implements IUsersRepository {
  public users: List<User> = List([initialUser]);
  public passwords = Map<string, string>(initialPassword);

  public async all(): Promise<Either<ExceptionError, ReadonlyArray<User>>> {
    return right(this.users.toArray());
  }

  public async delete(id: ID): Promise<Either<ExceptionError, void>> {
    this.users = this.users.filter(user => user.id !== id);
    return right(void 0);
  }

  public async findByEmail(email: string): Promise<Option<User>> {
    const user = this.users.find(item => item.email === email);

    return fromNullable(user);
  }

  public async findByID(id: ID): Promise<Option<User>> {
    const user = this.users.find(item => item.id === id);
    return fromNullable(user);
  }

  public async isUserPasswordValid(id: ID, givenPassword: string): Promise<Either<ExceptionError, boolean>> {
    // Get the real user password
    const userPassword = this.passwords.get(id);
    if (isUndefined(userPassword)) {
      return left(createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found));
    }
    // Are password equals
    return right(userPassword === givenPassword);
  }

  public async save(user: User, password: string): Promise<Either<ExceptionError, void>> {
    this.users = this.users.push(user);
    this.passwords = this.passwords.set(user.id, password);

    return right(void 0);
  }

  public async update(updatedUser: User, password?: string): Promise<Either<ExceptionError, void>> {
    this.users = this.users.map(user => (user.id === updatedUser.id ? updatedUser : user));
    if (password) {
      this.passwords = this.passwords.set(updatedUser.id, password);
    }

    return right(void 0);
  }
}
