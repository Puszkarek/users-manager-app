import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { USER_ROLE } from '@api-interfaces';
import { UsersStore } from '@front/app/stores/users';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private readonly _usersStore: UsersStore) {}

  /**
   * If the user have `admin` permissions, keep navigating to the page that the he wants,
   * otherwise keep him at the current page
   */
  public canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._usersStore.loggedUser$.pipe(
      map(user => {
        if (user?.role === USER_ROLE.admin) {
          return true;
        }

        return false;
      }),
    );
  }
}
