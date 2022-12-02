import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatableUser, isUser, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { LoginStatus } from '@front/app/interfaces/auth';
import { TokenManagerService } from '@front/app/services/token-manager';
import { toError } from '@front/app/utils';
import { environment } from '@front/environments/environment';
import { Either, isRight, left, right } from 'fp-ts/lib/Either';
import { isArray, isNull, isString } from 'lodash-es';
import { BehaviorSubject, catchError, firstValueFrom, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersClient {
  private readonly _loggedStatus$ = new BehaviorSubject<LoginStatus>({
    status: 'undefined',
  });

  public readonly authAction$ = this._loggedStatus$.asObservable();

  constructor(private readonly _http: HttpClient, private readonly _tokenManagerService: TokenManagerService) {}

  // * Update Methods

  public async updateOne(updatableUser: UpdatableUser): Promise<Either<Error, User>> {
    // TODO: can it be a websocket?
    const either = await firstValueFrom(
      this._http.put<User>(`${environment.apiHost}/users`, updatableUser).pipe(
        map(response => {
          // TODO: Replace the if by a fp-ts function
          if (isUser(response)) {
            return right(response);
          }
          console.error('Invalid response', response);
          return left(new Error('Invalid response'));
        }),
        catchError((error: unknown) => of(left(toError(error)))),
      ),
    );

    return either;
  }
  // * Delete Methods

  public async createOne(creatableUser: CreatableUser): Promise<Either<Error, User>> {
    const either = await firstValueFrom(
      this._http.post<User>(`${environment.apiHost}/users`, creatableUser).pipe(
        map(response => {
          // TODO: Replace the if by a fp-ts function
          if (isUser(response)) {
            return right(response);
          }
          console.error('Invalid response', response);
          return left(new Error('Invalid response'));
        }),
        catchError((error: unknown) => of(left(toError(error)))),
      ),
    );

    return either;
  }
  // * Create Methods

  public async deleteOne(id: string): Promise<Either<Error, void>> {
    const either = await firstValueFrom(
      this._http.delete(`${environment.apiHost}/users/${id}`).pipe(
        map(() => right(void 0)),
        catchError((error: unknown) => of(left(toError(error)))),
      ),
    );

    return either;
  }

  // * Get Methods
  public async getAll(): Promise<Either<Error, ReadonlyArray<User>>> {
    // TODO: can it be a websocket?
    const either = await firstValueFrom(
      this._http.get<ReadonlyArray<unknown>>(`${environment.apiHost}/users`).pipe(
        map(response => {
          if (isArray(response) && response.every(isUser)) {
            return right(response);
          }
          console.error('Invalid response', response);
          return left(new Error('Invalid response'));
        }),
        catchError((error: unknown) => of(left(toError(error)))),
      ),
    );

    return either;
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
          email,
          password,
        })
        .pipe(
          map(response => {
            if (isString(response.token) && isUser(response.loggedUser)) {
              this._updateLoggedUser(response.loggedUser);
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
  public async getMe(): Promise<Either<Error, User>> {
    // Avoid unnecessary requests to the backend
    const savedToken = this._tokenManagerService.getToken();
    if (isNull(savedToken)) {
      return left(new Error('None token founded'));
    }

    const result: Either<Error, User> = await firstValueFrom(
      this._http
        .get<User>(`${environment.apiHost}/users/me`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          map(response => {
            if (isUser(response)) {
              this._updateLoggedUser(response);
              return right(response);
            }
            console.error('Invalid response', response);
            return left(new Error('Invalid response'));
          }),
          catchError((error: unknown) => {
            this._updateLoggedUser(null);
            return of(left(toError(error)));
          }),
        ),
    );

    return result;
  }

  public async logoutOne(token: string): Promise<Either<Error, void>> {
    const result: Either<Error, void> = await firstValueFrom(
      // TODO (token): we need to "un-validate" the token
      of(token).pipe(
        map(() => {
          this._updateLoggedUser(null);
          return right(void 0);
        }),
        catchError((error: unknown) => of(left(toError(error)))),
      ),
    );

    if (isRight(result)) {
      this._loggedStatus$.next({
        status: 'logout',
      });
    }

    return result;
  }

  private _updateLoggedUser(user: User | null): void {
    if (isNull(user)) {
      this._loggedStatus$.next({
        status: 'needs-login',
      });
    } else {
      this._loggedStatus$.next({
        status: 'logged',
        user: user,
      });
    }
  }
}
