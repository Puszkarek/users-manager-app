import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@api-interfaces';
import { UsersClient } from '@front/app/clients/users';
import { TokenManagerService } from '@front/app/services/token-manager';
import { UsersStore } from '@front/app/stores/users';
import { Either, isLeft, left, right } from 'fp-ts/Either';
import { isNull } from 'lodash-es';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // TODO (feature): check if the auth token expires every 5 seconds
  // TODO: May all these methods should be inside `users.store`
  constructor(
    private readonly _usersClient: UsersClient,
    private readonly _usersStore: UsersStore,
    private readonly _tokenManager: TokenManagerService,
    private readonly _router: Router,
  ) {}

  /**
   * Make a request to login the user with the given data
   *
   * @param email - The supposed user's email
   * @param password - The supposed user's password
   * @returns An {@link Either} with the {@link User} on success, otherwise the {@link Error} that
   *   happened
   */
  public async login(email: string, password: string): Promise<Either<Error, User>> {
    const userEither = await this._usersClient.loginOne(email, password);

    if (isLeft(userEither)) {
      return left(userEither.left);
    }
    const loginResponse = userEither.right;

    this._tokenManager.setToken(loginResponse.token);

    return right(loginResponse.loggedUser);
  }

  /** Logout the current user, and delete all his cached data */
  public async logout(): Promise<void> {
    const savedToken = this._tokenManager.getToken();
    const loggedUser = await firstValueFrom(this._usersStore.loggedUser$);
    if (isNull(savedToken) || isNull(loggedUser)) {
      console.error("You're not logged");
      return;
    }

    this._usersClient.logoutOne();

    await this._router.navigateByUrl('/auth');
  }
}
