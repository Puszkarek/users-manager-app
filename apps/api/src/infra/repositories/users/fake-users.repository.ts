import { randomUUID } from 'node:crypto';

import { ID, User, USER_ROLE } from '@api-interfaces';
import { UsersRepository } from '@server/infra/interfaces';
import { ExceptionError } from '@server/infra/interfaces/error.interface';
import { array, task as T, taskEither as TE, taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
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
export const generateFakeUsersRepository = (): UsersRepository => {
  /** A fake users list, in a real case it'd a database */
  // eslint-disable-next-line functional/no-let
  let users: List<User> = List([DEFAULT_USER]);
  /** A fake password list, in a real case it'd a database */
  // eslint-disable-next-line functional/no-let
  let passwords = Map<string, string>({ [DEFAULT_USER.id]: DEFAULT_USER_PASSWORD });

  // * Reset the repository each x seconds
  const MILLISECONDS_INTERVAL = 7_200_000; // 2 hours
  timer(MILLISECONDS_INTERVAL, MILLISECONDS_INTERVAL).subscribe(() => {
    // Re-init the user list
    users = List([DEFAULT_USER]);
    // Re-init the password list
    passwords = Map<string, string>({ [DEFAULT_USER.id]: DEFAULT_USER_PASSWORD });
  });

  return {
    /**
     * Fetch all the available users in our database
     *
     * @returns On success a list of users, otherwise the error that happened
     */
    all: (): TaskEither<ExceptionError, ReadonlyArray<User>> => {
      return pipe(users.toArray(), TE.right);
    },

    // * Find Users

    /**
     * Try to find an {@link User} with the given `email`
     *
     * @param email - The email to fetch
     * @returns An {@link Option} containing the found `User` or nothing
     */
    findByEmail: (email: string): TaskOption<User> => {
      return pipe(
        users.find(item => item.email === email),
        TO.fromNullable,
      );
    },

    /**
     * Try to find an {@link User} with the given {@link ID}
     *
     * @param id - The ID to fetch
     * @returns An {@link Option} containing the found `User` or nothing
     */
    findByID: (id: ID): TaskOption<User> => {
      return pipe(
        users.find(item => item.id === id),
        TO.fromNullable,
      );
    },

    // * Crud User Actions

    /**
     * Deletes the {@link User} with the given {@link ID} from the repository
     *
     * @param id - The {@link ID} from the user that we wanna delete
     * @returns On success it'll be void, otherwise the error that happened
     */
    delete: (id: ID): TaskEither<ExceptionError, void> => {
      users = users.filter(user => user.id !== id);

      return TE.right(void 0);
    },

    /**
     * Saves a new {@link User} in the repository
     *
     * @param user - The user to save
     * @param password - The password to link with the new user
     * @returns On success it'll be void, otherwise the error that happened
     */
    save: (user: User, password: string): TaskEither<ExceptionError, User> => {
      users = users.push(user);
      passwords = passwords.set(user.id, password);

      return TE.right(user);
    },

    /**
     * Updates an existing {@link User} in the repository
     *
     * @param user - The user to update
     * @param password - An optional value, if passed it'll update the user password
     * @returns On success it'll be void, otherwise the error that happened
     */
    update: (updatedUser: User, password?: string): TaskEither<ExceptionError, User> => {
      users = users.map(user => (user.id === updatedUser.id ? updatedUser : user));
      if (password) {
        passwords = passwords.set(updatedUser.id, password);
      }

      return TE.right(updatedUser);
    },

    // * User Helpers

    /**
     * Gets the user with the given ID, then check if the given password match with the current
     * one
     *
     * @param id - The {@link ID} from the user to validate
     * @param passwordToCheck - May the user's password, it'll be validate
     * @returns True if passwords match, otherwise false
     */
    isUserPasswordValid: (id: ID, passwordToCheck: string): Task<boolean> => {
      // Compare the real user's password with the given one
      const passwordMatch = passwords.get(id) === passwordToCheck;

      return pipe(passwordMatch, T.of);
    },

    /**
     * Gets the user with the given ID, then check if the given password match with the current
     * one
     *
     * @param email - The possible users's `email` to validate
     * @returns True if the email is available, otherwise false
     */
    isEmailAvailable: (email: string): Task<boolean> => {
      return pipe(
        users.toArray(),
        array.every(user => user.email !== email),
        T.of,
      );
    },
  };
};
