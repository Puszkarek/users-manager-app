import { Injectable, OnDestroy } from '@angular/core';
import { CreatableUser, UpdatableUser, User, USER_ROLE } from '@api-interfaces';
import { UsersClient } from '@front/clients';
import { IStore, StoreLoadOptions } from '@front/interfaces';
import { USER_ENTITY_NAME } from '@front/stores/root';
import { isTrue, toError } from '@front/utils';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Either } from 'fp-ts/Either';
import { foldW, isRight } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { List } from 'immutable';
import { combineLatest, firstValueFrom, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, takeUntil } from 'rxjs/operators';

import { TypedEntityCollectionServiceBase } from '../../interfaces/store.interface';

@Injectable({ providedIn: 'root' })
// TODO (docs): write function docs
export class UsersStore implements IStore<User, UpdatableUser, CreatableUser>, OnDestroy {
  private readonly _entityCollection: TypedEntityCollectionServiceBase<User> = new EntityCollectionServiceBase<User>(
    USER_ENTITY_NAME,
    this._serviceElementsFactory,
  );

  // * Common Decorators
  public readonly count$ = this._entityCollection.count$;

  public readonly loading$ = this._entityCollection.loading$;
  public readonly loaded$ = this._entityCollection.loaded$;

  // * Users Decorators
  public readonly loggedUser$: Observable<User | null> = this._usersClient.authAction$.pipe(
    distinctUntilChanged(),
    map(auth => (auth.status === 'logged' ? auth.user : null)),
    shareReplay(1),
  );

  public readonly isLoggedUserAdmin$: Observable<boolean> = this.loggedUser$.pipe(
    map(user => user?.role === USER_ROLE.admin),
  );

  public readonly isAuthenticated$ = combineLatest([this._usersClient.authAction$, this.loaded$]).pipe(
    map(([{ status }, loaded]) => (status === 'logged' && loaded ? true : false)),
    shareReplay(1),
  );

  public readonly onLogout$ = this._usersClient.authAction$.pipe(
    map(({ status }) => status === 'logout'),
    distinctUntilChanged(),
    filter(isTrue),
    shareReplay(1),
  );

  private readonly _unsubscribe$ = new Subject<void>();

  constructor(
    private readonly _usersClient: UsersClient,
    private readonly _serviceElementsFactory: EntityCollectionServiceElementsFactory,
  ) {
    this.onLogout$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
      this._clearCache();
    });
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  public async load(options?: StoreLoadOptions): Promise<void> {
    const isLoaded = await firstValueFrom(this.loaded$);
    if (options?.force === true || !isLoaded) {
      if (options?.clearCache === true) {
        this._clearCache();
      }
      const either = await this._usersClient.getAll();
      pipe(
        either,
        foldW(
          () => void 0,
          users => this._entityCollection.upsertManyInCache(users),
        ),
      );
    }
  }

  private _clearCache(): void {
    this._entityCollection.clearCache();
  }

  public async create(user: CreatableUser): Promise<Either<Error, User>> {
    // Update user
    const either = await this._usersClient.createOne(user);

    // Add to cache
    if (isRight(either)) {
      this._entityCollection.upsertOneInCache(either.right);
    }

    return either;
  }

  public async update(user: UpdatableUser): Promise<Either<Error, User>> {
    // Update user
    const either = await this._usersClient.updateOne(user);

    // Add to cache
    if (isRight(either)) {
      this._entityCollection.upsertOneInCache(either.right);
    }

    return either;
  }

  /**
   * Delete a user from the database and the state (users that are admin can delete users).
   *
   * @param assetID The user ID to delete
   * @returns a either containing the error or nothing
   */
  public async delete(assetID: string): Promise<Either<Error, string>> {
    // TODO: idk if `tryCatch` still necessary since we are using a try catch inside the client, but we can discuss that later
    const taskEither = tryCatch(async () => {
      const either = await this._usersClient.deleteOne(assetID);

      // Remove from cache
      if (isRight(either)) {
        this._entityCollection.removeOneFromCache(assetID);
      }

      return assetID;
    }, toError);

    return taskEither();
  }

  public getAll(): Observable<List<User>> {
    return this._entityCollection.entities$.pipe(map(List), shareReplay({ bufferSize: 1, refCount: false }));
  }

  public getOne(id: string): Observable<User | null> {
    return this._entityCollection.entityMap$.pipe(
      map(dictionary => dictionary[id] ?? null),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }
}
