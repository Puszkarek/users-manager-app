import { ID, User, USER_ROLE } from '@api-interfaces';
import { IUsersRepository } from '@server/infra/interfaces';
import { List, Map } from 'immutable';
import { uniqueId } from 'lodash';

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

  public async all(): Promise<ReadonlyArray<User>> {
    return this.users.toArray();
  }

  public async delete(id: ID): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(item => item.email === email);
    return user ?? null;
  }

  public async findByID(id: ID): Promise<User | null> {
    const user = this.users.find(item => item.id === id);
    return user ?? null;
  }

  public async isUserPasswordValid(id: ID, givenPassword: string): Promise<boolean> {
    // Get the real user password
    const userPassword = this.passwords.get(id);

    // Are password equals
    return userPassword === givenPassword;
  }

  public async save(user: User, password: string): Promise<void> {
    this.users = this.users.push(user);
    this.passwords = this.passwords.set(user.id, password);
  }

  public async update(updatedUser: User, password?: string): Promise<void> {
    this.users = this.users.map(user => (user.id === updatedUser.id ? updatedUser : user));
    if (password) {
      this.passwords = this.passwords.set(updatedUser.id, password);
    }
  }
}
