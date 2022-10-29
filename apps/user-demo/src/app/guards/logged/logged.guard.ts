import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersStore } from '@front/stores';

@Injectable({
  providedIn: 'root',
})

/**
 * LoggedGuard check if the logged user.
 *
 * If logged, it will redirect to the main page, this extra validation to avoid to access the login page when the user is not logged
 */
export class LoggedGuard implements CanActivate {
  constructor(
    private readonly _usersStore: UsersStore,
    private readonly _router: Router
  ) {}

  public canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._usersStore.isAuthenticated$.pipe(
      map((isAuthenticated) =>
        isAuthenticated ? this._router.createUrlTree(['/']) : true
      )
    );
  }
}
