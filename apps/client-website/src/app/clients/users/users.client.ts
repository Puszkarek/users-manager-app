import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatableUser, isUser, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { LoginStatus } from '@front/app/interfaces/auth';
import { TokenManagerService } from '@front/app/services/token-manager';
import { toError } from '@front/app/utils';
import { environment } from '@front/environments/environment';
import { Either, left, right } from 'fp-ts/lib/Either';
import { isArray, isNull, isString } from 'lodash-es';
import { BehaviorSubject, catchError, firstValueFrom, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersClient {
  /** The base URL to use in requests */
  private readonly _baseURL = environment.apiHost;

  private readonly _loggedStatus$ = new BehaviorSubject<LoginStatus>({
    status: 'undefined',
  });

  public readonly authAction$ = this._loggedStatus$.asObservable();

  constructor(private readonly _http: HttpClient, private readonly _tokenManagerService: TokenManagerService) {}

  // * Update Methods

  public async updateOne(updatableUser: UpdatableUser): Promise<Either<Error, User>> {
    // TODO: can it be a websocket?
    const either = await firstValueFrom(
      this._http.put<User>(`${this._baseURL}/users`, updatableUser).pipe(
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
      this._http.post<User>(`${this._baseURL}/users`, creatableUser).pipe(
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
      this._http.delete(`${this._baseURL}/users/${id}`).pipe(
        map(() => right(void 0)),
        catchError((error: unknown) => of(left(toError(error)))),
      ),
    );

    return either;
  }

  // * Get Methods
  public async getAll(): Promise<Either<Error, ReadonlyArray<User>>> {
    const either = await firstValueFrom(
      this._http.get<ReadonlyArray<unknown>>(`${this._baseURL}/users`).pipe(
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

  /** Fetch a user with the given ID */
  public getOne(id: string): Observable<User> {
    // TODO: should be `Observable<Option<User>>`
    return this._http.get<User>(`TODO/${id}`);
  }

  // * Login Methods

  /**
   * Will try to login the user with the given data
   *
   * When the request returns without errors it'll update the {@link authAction$} with the
   * received user
   *
   * @param email - User's email
   * @param password - User's password
   * @returns An `Either` with the api response
   */
  public async loginOne(email: string, password: string): Promise<Either<Error, LoginResponse>> {
    const result: Either<Error, LoginResponse> = await firstValueFrom(
      this._http
        .post<LoginResponse>(`${this._baseURL}/users/login`, {
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
   * Get the saved token, then fetch the api for the User
   *
   * @returns On success will wrap the user in a `Right`, or in case some error happens will
   *   return the Error wrapped in a `Left`
   */
  public async getMe(): Promise<Either<Error, User>> {
    // Avoid unnecessary requests to the backend
    const savedToken = this._tokenManagerService.getToken();
    if (isNull(savedToken)) {
      return left(new Error('None token founded'));
    }

    const result: Either<Error, User> = await firstValueFrom(
      this._http
        .get<User>(`${this._baseURL}/users/me`, {
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

  /** Delete the token from local storage and emits a new value for {@link authAction$} */
  public logoutOne(): Either<Error, void> {
    // TODO: revoke the token
    this._tokenManagerService.setToken(null);
    this._updateLoggedUser(null);

    this._loggedStatus$.next({
      status: 'logout',
    });

    return right(void 0);
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
