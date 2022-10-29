import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { USER_ROLE } from '@front/interfaces';
import { UsersStore } from '@front/stores';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly _usersStore: UsersStore,
    private readonly _router: Router
  ) {}

  public canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._usersStore.loggedUser$.pipe(
      map((user) => {
        if (user?.role === USER_ROLE.admin) {
          return true;
        }

        return this._router.createUrlTree(['/auth']);
      })
    );
  }
}
