import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UsersClient } from '@front/app/clients/users';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoggedGuard implements CanActivate {
  constructor(private readonly _usersClient: UsersClient, private readonly _router: Router) {}

  /**
   * If the user is already logged, then redirect to the main page
   *
   * P.S: It's an validation to avoid the access to the `Login` page when already had logged
   */
  public canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._usersClient.authAction$.pipe(
      switchMap(loginStatus => {
        // Load it in case ins't loaded yet
        if (loginStatus.status === 'undefined') {
          return from(this._usersClient.getMe()).pipe(switchMap(() => this._usersClient.authAction$));
        }
        return of(loginStatus);
      }),
      map(({ status }) => {
        // If the user is already logged redirect to the previous page
        return status === 'logged' ? this._router.createUrlTree(['/']) : true; // TODO: redirect to the route that she was trying to access
      }),
    );
  }
}
