import { Injectable } from '@angular/core';
import { AuthToken } from '@api-interfaces';
import { isString } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class TokenManagerService {
  // * Token
  public setToken(authToken: AuthToken | null): void {
    if (authToken) {
      sessionStorage.setItem('token', authToken);
    } else {
      sessionStorage.removeItem('token');
    }
  }

  public getToken(): AuthToken | null {
    const authToken = sessionStorage.getItem('token');

    if (isString(authToken)) {
      return authToken;
    }

    return null;
  }
}
