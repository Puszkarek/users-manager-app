import { Injectable } from '@angular/core';
import { AuthToken } from '@api-interfaces';
import { isString } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class TokenManagerService {
  // * Token
  public setToken(authToken: AuthToken): void {
    if (authToken) {
      sessionStorage.setItem('token', authToken);
    } else {
      sessionStorage.removeItem('token');
    }
  }

  public getToken(): AuthToken | null {
    const token = sessionStorage.getItem('token');

    if (isString(token)) {
      return token;
    }

    return null;
  }
}
