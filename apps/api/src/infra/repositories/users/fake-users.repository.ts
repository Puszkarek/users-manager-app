/* eslint-disable @typescript-eslint/require-await */
import { randomUUID } from 'node:crypto';

import { AuthToken, ID, User, USER_ROLE } from '@api-interfaces';
import { createExceptionError, extractError } from '@server/infra/helpers/error';
import { UsersRepository } from '@server/infra/interfaces';
import { ExceptionError, REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { taskEither, taskOption } from 'fp-ts';
import { Either, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { fromNullable, Option } from 'fp-ts/lib/Option';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { List, Map } from 'immutable';
import * as jose from 'jose';
import { isString } from 'lodash';
import { timer } from 'rxjs';

// TODO: replace `JWTVerifyResult` by a abstract interface

/** The system should initialize with a default user */
export const DEFAULT_USER: User = {
  email: 'admin@admin',
  id: randomUUID(),
  name: 'Admin',
  role: USER_ROLE.admin,
};
export const DEFAULT_USER_PASSWORD = 'admin';

/** This is a demo repository for testing */
export class FakeUsersRepository implements UsersRepository {
  /** A fake users list, in a real case it'd a database */
  private _users: List<User> = List([DEFAULT_USER]);

  /** A fake password list, in a real case it'd a database */
  private _passwords = Map<string, string>({ [DEFAULT_USER.id]: DEFAULT_USER_PASSWORD });

  // * Token
  /** The key that we use to encrypt the token, so that it just can be read at our backend */
  private readonly _tokenSecret = new TextEncoder().encode('ADD-SECRET-KEY-LATER'); // TODO: move to `.env`

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
  public async all(): Promise<Either<ExceptionError, ReadonlyArray<User>>> {
    return right(this._users.toArray());
  }

  // * Find Users

  /**
   * Try to find an {@link User} with the given `email`
   *
   * @param email - The email to fetch
   * @returns An {@link Option} containing the found `User` or nothing
   */
  public async findByEmail(email: string): Promise<Option<User>> {
    const user = this._users.find(item => item.email === email);

    return fromNullable(user);
  }

  /**
   * Try to find an {@link User} with the given {@link ID}
   *
   * @param id - The ID to fetch
   * @returns An {@link Option} containing the found `User` or nothing
   */
  public async findByID(id: ID): Promise<Option<User>> {
    const user = this._users.find(item => item.id === id);
    return fromNullable(user);
  }

  /**
   * Parse the given token and try to find an {@link User} with that
   *
   * @param token - The token that belongs to the user
   * @returns An {@link Option} containing the found `User` or nothing
   */
  public findByToken(token: AuthToken): taskOption.TaskOption<User> {
    return pipe(
      // * Parse the token
      token,
      this.parseToken,
      taskOption.fromTaskEither,
      // * Extract the `userID` from payload
      taskOption.chain(({ payload: { userID } }) => taskOption.fromNullable(isString(userID) ? userID : null)), // TODO: improve validation
      // * Try to find the user
      taskOption.chain(userID => taskOption.fromNullable(this._users.find(user => user.id === userID))),
    );
  }

  // * Crud User Actions

  /**
   * Deletes the {@link User} with the given {@link ID} from the repository
   *
   * @param id - The {@link ID} from the user that we wanna delete
   * @returns On success it'll be void, otherwise the error that happened
   */
  public delete(id: ID): taskEither.TaskEither<ExceptionError, void> {
    this._users = this._users.filter(user => user.id !== id);
    return taskEither.right(void 0);
  }

  /**
   * Saves a new {@link User} in the repository
   *
   * @param user - The user to save
   * @param password - The password to link with the new user
   * @returns On success it'll be void, otherwise the error that happened
   */
  public async save(user: User, password: string): Promise<Either<ExceptionError, void>> {
    this._users = this._users.push(user);
    this._passwords = this._passwords.set(user.id, password);

    return right(void 0);
  }

  /**
   * Updates an existing {@link User} in the repository
   *
   * @param user - The user to update
   * @param password - An optional value, if passed it'll update the user password
   * @returns On success it'll be void, otherwise the error that happened
   */
  public async update(updatedUser: User, password?: string): Promise<Either<ExceptionError, void>> {
    this._users = this._users.map(user => (user.id === updatedUser.id ? updatedUser : user));
    if (password) {
      this._passwords = this._passwords.set(updatedUser.id, password);
    }

    return right(void 0);
  }

  // * User Helpers

  /**
   * Gets the user with the given ID, then check if the given password match with the current
   * one
   *
   * @param id - The {@link ID} from the user to validate
   * @param passwordToCheck - May the user's password, it'll be validate
   * @returns True if passwords match, otherwise false
   */
  public async isUserPasswordValid(id: ID, passwordToCheck: string): Promise<boolean> {
    // Get the real user password
    const userPassword = this._passwords.get(id);

    return userPassword === passwordToCheck;
  }

  // * Tokens

  /**
   * Check if the given {@link ID} is valid, then generate a token linked with the respective
   * {@link User}
   *
   * @param userID - The id
   * @returns The token that was generated
   */
  public generateToken(userID: User['id']): TaskEither<ExceptionError, AuthToken> {
    // Verify if the user exists
    if (!this._users.some(user => user.id === userID)) {
      return taskEither.left(createExceptionError('Given user ID is invalid', REQUEST_STATUS.bad));
    }

    return pipe(
      // * Create the new token
      userID,
      this._createToken,
    );
  }

  // TODO: move tokens methods to a single interface

  /**
   * Generates and encrypt a token for the related user
   *
   * @param userID - The user {@link ID} to attach in the token
   * @returns The generated token
   */
  private _createToken(userID: string): TaskEither<ExceptionError, AuthToken> {
    return taskEither.tryCatch(
      async () =>
        await new jose.SignJWT({ userID })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setIssuer('urn:example:issuer') // TODO: i don't know what really is it
          .setAudience('urn:example:audience')
          .setExpirationTime('1d')
          .sign(this._tokenSecret),
      error => createExceptionError(extractError(error).message, REQUEST_STATUS.bad),
    );
  }

  /**
   * Parses the given {@link AuthToken} and returns the results
   *
   * P.S: it'll catch an error when:
   *
   * 1. The format be wrong
   * 2. When the token secret doesn't match
   * 3. Or when it expire
   *
   * @param JWT - The token to parse
   * @returns On success the parsed token, otherwise the error that happened
   */
  public parseToken(JWT: AuthToken): TaskEither<ExceptionError, jose.JWTVerifyResult> {
    return tryCatch(
      async () => {
        const parsedJWT = await jose.jwtVerify(JWT, this._tokenSecret, {
          issuer: 'urn:example:issuer',
          audience: 'urn:example:audience',
        });
        return parsedJWT;
      },
      error => {
        return createExceptionError(extractError(error).message, REQUEST_STATUS.bad);
      },
    );
  }
}
