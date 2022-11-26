import { randomUUID } from 'node:crypto';

import { ID, User, USER_ROLE, UserToken } from '@api-interfaces';
import { createExceptionError, extractError } from '@server/infra/helpers/error.helper';
import { IUsersRepository } from '@server/infra/interfaces';
import { ExceptionError, REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { Either, isLeft, isRight, left, right } from 'fp-ts/lib/Either';
import { fromNullable, Option } from 'fp-ts/lib/Option';
import { List, Map } from 'immutable';
import * as jose from 'jose';
import { isString } from 'lodash';

// TODO: replace `JWTVerifyResult` by a abstract interface

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

  // * Token
  private readonly _secret = new TextEncoder().encode('ADD-SECRET-KEY-LATER');

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
    console.log('TOKEN TO SEARCH', token);
    const tokenE = await this._parseToken(token);
    if (isLeft(tokenE)) {
      return fromNullable(null);
    }

    const { userID } = tokenE.right.payload;
    if (!isString(userID)) {
      return fromNullable(null);
    }

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
  public async addToken(userID: User['id']): Promise<Either<ExceptionError, UserToken>> {
    // Verify if the user exists
    if (!this._users.some(user => user.id === userID)) {
      return left(createExceptionError('Given user ID is invalid', REQUEST_STATUS.bad));
    }

    // Create the new token
    const newToken = await this._createToken(userID);

    // Returns the token ID
    return right(newToken);
  }

  public async isUserTokenValid(token: UserToken): Promise<boolean> {
    // Get the real user password
    const tokenMetadata = await this._parseToken(token);

    return isRight(tokenMetadata);
  }

  // TODO: move tokens methods to a single interface

  private async _createToken(userID: string): Promise<UserToken> {
    const JWT = await new jose.SignJWT({ userID })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer('urn:example:issuer')
      .setAudience('urn:example:audience')
      .setExpirationTime('1d')
      .sign(this._secret);

    return JWT;
  }

  private async _parseToken(JWT: UserToken): Promise<Either<ExceptionError, jose.JWTVerifyResult>> {
    try {
      const parsedJWT = await jose.jwtVerify(JWT, this._secret, {
        issuer: 'urn:example:issuer',
        audience: 'urn:example:audience',
      });
      return right(parsedJWT);
    } catch (error: unknown) {
      return left(createExceptionError(extractError(error).message, REQUEST_STATUS.bad));
    }
  }
}
