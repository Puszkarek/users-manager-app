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
      localStorage.setItem('token', authToken);
    } else {
      localStorage.removeItem('token');
    }
  }

  public getToken(): AuthToken | null {
    const authToken = localStorage.getItem('token');

    if (isString(authToken)) {
      return authToken;
    }

    return null;
  }
}
