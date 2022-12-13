import { Injectable } from '@angular/core';
import { AuthToken } from '@api-interfaces';
import { isEmpty, isString } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class TokenManagerService {
  /**
   * Update the token in {@link localStorage}
   *
   * @param authToken - The new token to save
   */
  public setToken(authToken: AuthToken | null): void {
    if (authToken) {
      localStorage.setItem('token', authToken);
    } else {
      localStorage.removeItem('token');
    }
  }

  /**
   * Load the token saved in {@link localStorage}
   *
   * @returns If existing, the {@link AuthToken}, otherwise `null`
   */
  public getToken(): AuthToken | null {
    const authToken = localStorage.getItem('token');

    if (isString(authToken) || isEmpty(authToken)) {
      return authToken;
    }

    return null;
  }
}
