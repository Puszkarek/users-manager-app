import { Injectable } from '@angular/core';
import { User } from '@api-interfaces';
import { UsersClient } from '@front/clients';
import { UsersStore } from '@front/stores';
import { Either, isLeft, left, right } from 'fp-ts/Either';
import { isNull } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // TODO (feature): check if the auth token expires every 5 seconds
  constructor(private readonly _usersClient: UsersClient, private readonly _usersStore: UsersStore) {}

  public async load(): Promise<void> {
    const savedLogin = this._getToken();

    if (isNull(savedLogin)) {
      return;
    }

    const either = await this._usersClient.loginOneWithToken(savedLogin.email, savedLogin.token);

    if (isLeft(either)) {
      console.error(either.left);
      return;
    }

    this._setToken({ email: savedLogin.email, newToken: either.right.token });
  }

  public async login(email: string, password: string): Promise<Either<Error, User>> {
    const userEither = await this._usersClient.loginOne(email, password);

    if (isLeft(userEither)) {
      return left(userEither.left);
    }
    const loginResponse = userEither.right;

    this._setToken({
      email: loginResponse.loggedUser.email,
      newToken: loginResponse.token,
    });

    return right(loginResponse.loggedUser);
  }

  public async logoutUser(): Promise<void> {
    const savedLogin = this._getToken();
    const loggedUser = await firstValueFrom(this._usersStore.loggedUser$);
    if (isNull(savedLogin) || isNull(loggedUser)) {
      console.error('None user is logged');
      return;
    }

    const userEither = await this._usersClient.logoutOne(savedLogin.token);

    if (isLeft(userEither)) {
      console.error('Something gones wrong', userEither);
    }
  }

  // * Token
  private _setToken({ newToken, email }: { readonly newToken: string | null; readonly email: string | null }): void {
    if (newToken && email) {
      sessionStorage.setItem('token', newToken);
      sessionStorage.setItem('email', email);
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('email');
    }
  }

  private _getToken(): {
    readonly email: string;
    readonly token: string;
  } | null {
    const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('email');

    if (token && email) {
      return { email, token };
    }
    return null;
  }
}
