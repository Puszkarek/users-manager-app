import { randomUUID } from 'node:crypto';

import { ID, User, USER_ROLE } from '@api-interfaces';
import { UsersRepository } from '@server/infra/interfaces';
import { ExceptionError } from '@server/infra/interfaces/error.interface';
import { task as T, taskEither as TE, taskOption as TO } from 'fp-ts';
import { Task } from 'fp-ts/lib/Task';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { TaskOption } from 'fp-ts/lib/TaskOption';
import { List, Map } from 'immutable';
import { timer } from 'rxjs';

/** The system should initialize with a default user */
export const DEFAULT_USER: User = {
  email: 'admin@admin',
  id: randomUUID(),
  name: 'Admin',
  role: USER_ROLE.admin,
};
export const DEFAULT_USER_PASSWORD = 'admin';

// TODO: may remove the class and use factory methods
/** This is a demo repository for testing */
export class FakeUsersRepository implements UsersRepository {
  /** A fake users list, in a real case it'd a database */
  private _users: List<User> = List([DEFAULT_USER]);

  /** A fake password list, in a real case it'd a database */
  private _passwords = Map<string, string>({ [DEFAULT_USER.id]: DEFAULT_USER_PASSWORD });

  constructor() {
    const MILLISECONDS_INTERVAL = 7_200_000; // 2 hours

    // * Reset the repository each x seconds
    timer(MILLISECONDS_INTERVAL, MILLISECONDS_INTERVAL).subscribe(() => {
      // Re-init the user list
      this._users = List([DEFAULT_USER]);
      // Re-init the password list
      this._passwords = Map<string, string>({ [DEFAULT_USER.id]: DEFAULT_USER_PASSWORD });
    });
  }

  /**
   * Fetch all the available users in our database
   *
   * @returns On success a list of users, otherwise the error that happened
   */
  public readonly all = (): TaskEither<ExceptionError, ReadonlyArray<User>> => {
    return TE.right(this._users.toArray());
  };

  // * Find Users

  /**
   * Try to find an {@link User} with the given `email`
   *
   * @param email - The email to fetch
   * @returns An {@link Option} containing the found `User` or nothing
   */
  public readonly findByEmail = (email: string): TaskOption<User> => {
    const user = this._users.find(item => item.email === email);

    return TO.fromNullable(user);
  };

  /**
   * Try to find an {@link User} with the given {@link ID}
   *
   * @param id - The ID to fetch
   * @returns An {@link Option} containing the found `User` or nothing
   */
  public readonly findByID = (id: ID): TaskOption<User> => {
    const user = this._users.find(item => item.id === id);
    return TO.fromNullable(user);
  };

  // * Crud User Actions

  /**
   * Deletes the {@link User} with the given {@link ID} from the repository
   *
   * @param id - The {@link ID} from the user that we wanna delete
   * @returns On success it'll be void, otherwise the error that happened
   */
  public readonly delete = (id: ID): TaskEither<ExceptionError, void> => {
    this._users = this._users.filter(user => user.id !== id);
    return TE.right(void 0);
  };

  /**
   * Saves a new {@link User} in the repository
   *
   * @param user - The user to save
   * @param password - The password to link with the new user
   * @returns On success it'll be void, otherwise the error that happened
   */
  public readonly save = (user: User, password: string): TaskEither<ExceptionError, void> => {
    this._users = this._users.push(user);
    this._passwords = this._passwords.set(user.id, password);

    return TE.right(void 0);
  };

  /**
   * Updates an existing {@link User} in the repository
   *
   * @param user - The user to update
   * @param password - An optional value, if passed it'll update the user password
   * @returns On success it'll be void, otherwise the error that happened
   */
  public readonly update = (updatedUser: User, password?: string): TaskEither<ExceptionError, void> => {
    this._users = this._users.map(user => (user.id === updatedUser.id ? updatedUser : user));
    if (password) {
      this._passwords = this._passwords.set(updatedUser.id, password);
    }

    return TE.right(void 0);
  };

  // * User Helpers

  /**
   * Gets the user with the given ID, then check if the given password match with the current
   * one
   *
   * @param id - The {@link ID} from the user to validate
   * @param passwordToCheck - May the user's password, it'll be validate
   * @returns True if passwords match, otherwise false
   */
  public readonly isUserPasswordValid = (id: ID, passwordToCheck: string): Task<boolean> => {
    // Get the real user password
    const userPassword = this._passwords.get(id);

    return T.of(userPassword === passwordToCheck);
  };
}
