import { Injectable } from '@angular/core';
import { User, UserToken } from '@api-interfaces';
import { UsersClient } from '@front/app/clients/users';
import { UsersStore } from '@front/app/stores/users';
import { Either, isLeft, left, right } from 'fp-ts/Either';
import { isNull, isString } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // TODO (feature): check if the auth token expires every 5 seconds
  constructor(private readonly _usersClient: UsersClient, private readonly _usersStore: UsersStore) {
    this._usersStore.load();

    this.load();
  }

  public async load(): Promise<void> {
    const savedToken = this._getToken();

    if (isNull(savedToken)) {
      return;
    }

    console.log('login with token', savedToken);
    const either = await this._usersClient.getMe(savedToken);

    if (isLeft(either)) {
      console.error(either.left);
      return;
    }

    this._setToken(either.right.token);
  }

  public async login(email: string, password: string): Promise<Either<Error, User>> {
    const userEither = await this._usersClient.loginOne(email, password);

    if (isLeft(userEither)) {
      return left(userEither.left);
    }
    const loginResponse = userEither.right;

    this._setToken(loginResponse.token);

    return right(loginResponse.loggedUser);
  }

  public async logoutUser(): Promise<void> {
    const savedToken = this._getToken();
    const loggedUser = await firstValueFrom(this._usersStore.loggedUser$);
    if (isNull(savedToken) || isNull(loggedUser)) {
      console.error('None user is logged');
      return;
    }

    const userEither = await this._usersClient.logoutOne(savedToken);

    if (isLeft(userEither)) {
      console.error('Something gones wrong', userEither);
    }
  }

  // * Token
  private _setToken(userToken: UserToken): void {
    if (userToken) {
      sessionStorage.setItem('token', userToken);
    } else {
      sessionStorage.removeItem('token');
    }
  }

  private _getToken(): UserToken | null {
    const token = sessionStorage.getItem('token');

    if (isString(token)) {
      return token;
    }

    return null;
  }
}
