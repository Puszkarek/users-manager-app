/* eslint-disable functional/prefer-readonly-type */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isUser, LoginResponse, User } from '@api-interfaces';
import { LoginStatus } from '@front/interfaces';
import { toError } from '@front/utils';
import { Either, isRight, left, right } from 'fp-ts/lib/Either';
import { isString } from 'lodash-es';
import { BehaviorSubject, catchError, firstValueFrom, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersClient {
  private readonly _loggedStatus$ = new BehaviorSubject<LoginStatus>({
    status: 'undefined',
  });

  public readonly authAction$ = this._loggedStatus$.asObservable();

  constructor(private readonly _http: HttpClient) {}

  // * Update Methods

  // TODO (create) update method

  // * Delete Methods

  // TODO (create) delete method

  // * Create Methods

  // TODO (create) create method

  // * Get Methods
  public getAll(): Observable<Array<User>> {
    return this._http.get<Array<User>>(`${environment.apiHost}/api/users`);
  }

  public getOne(id: string): Observable<User> {
    return this._http.get<User>(`TODO/${id}`);
  }

  // TODO (create): getMe method

  // * Login Methods
  public async loginOne(email: string, password: string): Promise<Either<Error, LoginResponse>> {
    const result: Either<Error, LoginResponse> = await firstValueFrom(
      this._http
        .post<LoginResponse>(`${environment.apiHost}/users/login`, {
          headers: {
            email,
            password,
          },
        })
        .pipe(
          map(response => {
            if (isString(response.token) && isUser(response.loggedUser)) {
              return right(response);
            }
            console.error('Invalid response', response);
            return left(new Error('Invalid response'));
          }),
          catchError((error: unknown) => of(left(toError(error)))),
        ),
    );

    return result;
  }

  /**
   * Login the user with the token
   *
   * TODO: actually, this is using the user password because we still don't have a token system
   * TODO (token): we should create the system and methods for token in the backend
   */
  public async loginOneWithToken(email: string, token: string): Promise<Either<Error, LoginResponse>> {
    const result: Either<Error, LoginResponse> = await firstValueFrom(
      this._http
        .post<LoginResponse>(`${environment.apiHost}/users/login`, {
          headers: {
            email,
            // TODO (token): should use token property
            password: token,
          },
        })
        .pipe(
          map(response => {
            if (isString(response.token) && isUser(response.loggedUser)) {
              return right(response);
            }
            console.error('Invalid response', response);
            return left(new Error('Invalid response'));
          }),
          catchError((error: unknown) => of(left(toError(error)))),
        ),
    );

    if (isRight(result)) {
      this._loggedStatus$.next({
        status: 'logged',
        user: result.right.loggedUser,
      });
    }

    return result;
  }

  public async logoutOne(token: string): Promise<Either<Error, void>> {
    const result: Either<Error, void> = await firstValueFrom(
      // TODO (token): we need to "un-validate" the token
      of(token).pipe(
        map(() => {
          return right(void 0);
        }),
        catchError((error: unknown) => of(left(toError(error)))),
      ),
    );

    if (isRight(result)) {
      this._loggedStatus$.next({ status: 'logout' });
    }

    return result;
  }
}
