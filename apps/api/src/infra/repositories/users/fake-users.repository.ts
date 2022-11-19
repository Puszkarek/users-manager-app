import { randomUUID } from 'node:crypto';

import { ID, User, USER_ROLE, UserToken, UserTokenMetadata } from '@api-interfaces';
import { createExceptionError } from '@server/infra/helpers/error.helper';
import { IUsersRepository } from '@server/infra/interfaces';
import { ExceptionError, REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { Either, left, right } from 'fp-ts/lib/Either';
import { fromNullable, Option } from 'fp-ts/lib/Option';
import { List, Map } from 'immutable';
import { isUndefined } from 'lodash';

/** The system should initialize with a default user */
const initialUser: User = {
  email: 'admin@admin',
  id: randomUUID(),
  name: 'Admin',
  role: USER_ROLE.admin,
};
const initialPassword = { [initialUser.id]: 'admin' };

/**
 * This is a demo repository for testing
 */
export class FakeUsersRepository implements IUsersRepository {
  private _users: List<User> = List([initialUser]);
  private _passwords = Map<string, string>(initialPassword);
  private _tokens = Map<UserToken, UserTokenMetadata>();

  private readonly _defaultTokenExpirationTime = 86_400_000; // One day in ms

  public async all(): Promise<Either<ExceptionError, ReadonlyArray<User>>> {
    return right(this._users.toArray());
  }

  // * Find Users
  public async findByEmail(email: string): Promise<Option<User>> {
    const user = this._users.find(item => item.email === email);

    return fromNullable(user);
  }

  public async findByID(id: ID): Promise<Option<User>> {
    const user = this._users.find(item => item.id === id);
    return fromNullable(user);
  }

  public async findByToken(token: UserToken): Promise<Option<User>> {
    const tokenMetadata = this._tokens.get(token);
    if (!tokenMetadata) {
      return fromNullable(null);
    }

    const { userID } = tokenMetadata;
    const userFounded = this._users.find(user => user.id === userID);

    return fromNullable(userFounded);
  }

  // * Crud User Actions
  public async delete(id: ID): Promise<Either<ExceptionError, void>> {
    this._users = this._users.filter(user => user.id !== id);
    return right(void 0);
  }

  public async save(user: User, password: string): Promise<Either<ExceptionError, void>> {
    this._users = this._users.push(user);
    this._passwords = this._passwords.set(user.id, password);

    return right(void 0);
  }

  public async update(updatedUser: User, password?: string): Promise<Either<ExceptionError, void>> {
    this._users = this._users.map(user => (user.id === updatedUser.id ? updatedUser : user));
    if (password) {
      this._passwords = this._passwords.set(updatedUser.id, password);
    }

    return right(void 0);
  }

  // * User Helpers
  public async isUserPasswordValid(id: ID, givenPassword: string): Promise<boolean> {
    // Get the real user password
    const userPassword = this._passwords.get(id);

    return userPassword === givenPassword;
  }

  // * Tokens
  public async upsertToken(userID: User['id']): Promise<Either<ExceptionError, UserToken>> {
    // Verify if the user exists
    if (!this._users.some(user => user.id === userID)) {
      return left(createExceptionError('', REQUEST_STATUS.bad));
    }
    // If already exist a token, remove it
    const existingToken = this._tokens.get(userID);
    if (existingToken) {
      this._tokens.delete(userID);
    }

    // Create the new token
    const newUserToken = randomUUID();

    // Set the metadata
    this._tokens.set(newUserToken, {
      expireAt: this._getNewExpirationDate(),
      userID: userID,
    });

    // Returns the token ID
    return right(newUserToken);
  }

  public async isUserTokenValid(token: UserToken): Promise<boolean> {
    // Get the real user password
    const tokenMetadata = this._tokens.get(token);

    return !isUndefined(tokenMetadata) && !this._hasTokenExpired(tokenMetadata);
  }

  /**
   * Create a new valid expiration date to be used in the token
   * @returns
   */
  private _getNewExpirationDate(): Date {
    return new Date(Date.now() + this._defaultTokenExpirationTime);
  }

  /**
   * Check if the Token has expired
   *
   * @param tokenMetadata The metadata from token that we want to check
   * @returns True if the token has expired
   */
  private _hasTokenExpired(tokenMetadata: UserTokenMetadata): boolean {
    return Date.now() > tokenMetadata.expireAt.getTime();
  }
}
