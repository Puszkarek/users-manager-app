import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UsersClient } from '@front/app/clients/users';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly _usersClient: UsersClient, private readonly _router: Router) {}

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
        return status === 'needs-login' ? this._router.createUrlTree(['/auth']) : true;
      }),
    );
  }
}
