import { Injectable, OnDestroy } from '@angular/core';
import { CreatableUser, UpdatableUser, User, USER_ROLE } from '@api-interfaces';
import { UsersClient } from '@front/app/clients/users';
import { STORE_REFRESH_INTERVAL_TIME } from '@front/app/constants/store';
import { Store, StoreLoadOptions, TypedEntityCollectionService } from '@front/app/interfaces/store';
import { USER_ENTITY_NAME } from '@front/app/stores/root';
import { isTrue } from '@front/app/utils';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Either } from 'fp-ts/Either';
import { foldW, isRight } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { List } from 'immutable';
import { combineLatest, firstValueFrom, Observable, Subject, timer } from 'rxjs';
import { distinctUntilChanged, filter, first, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsersStore implements Store<User, UpdatableUser, CreatableUser>, OnDestroy {
  /** The service that will handle the cache */
  private readonly _entityCollection: TypedEntityCollectionService<User> = new EntityCollectionServiceBase<User>(
    USER_ENTITY_NAME,
    this._serviceElementsFactory,
  );

  /** Emits true when the store start to fetching data */
  public readonly loading$ = this._entityCollection.loading$;

  /** Emits true when the store finish to fetching data */
  public readonly loaded$ = this._entityCollection.loaded$;

  /** Emits the amount of entities in the cache */
  public readonly count$ = this._entityCollection.count$;

  /** The current user cached */
  public readonly loggedUser$: Observable<User | null> = this._usersClient.authAction$.pipe(
    distinctUntilChanged(),
    filter(auth => auth.status !== 'undefined'),
    map(auth => (auth.status === 'logged' ? auth.user : null)),
    shareReplay(1),
  );

  /** Emits, true when the current user is an admin, otherwise false */
  public readonly isLoggedUserAdmin$: Observable<boolean> = this.loggedUser$.pipe(
    map(user => user?.role === USER_ROLE.admin),
  );

  /** Emits, true when we have a current user cached, otherwise false */
  public readonly isAuthenticated$ = combineLatest([this._usersClient.authAction$]).pipe(
    map(([{ status }]) => status === 'logged'),
    shareReplay(1),
  );

  /** Will emit when we trigger the `authAction` with the `logout` state */
  public readonly logout$ = this._usersClient.authAction$.pipe(
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
    /** Listen to the logout action to clear the cache */
    this.logout$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
      this._clearCache();
    });

    /**
     * Wait to the user be authenticated, then load the store and refresh after x seconds, do
     * it in loop
     */
    this.isAuthenticated$
      // TODO: improve and move to a helper
      .pipe(
        first(isAuthenticated => isAuthenticated),
        switchMap(() => timer(0, STORE_REFRESH_INTERVAL_TIME)),
        takeUntil(this.logout$),
        takeUntil(this._unsubscribe$),
      )
      .subscribe(() => {
        this.load({
          force: true,
          clearCache: false,
        });
      });
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  /** Fetch all the required data from api */
  public async load(options?: StoreLoadOptions): Promise<void> {
    // Get the current store state
    const isLoaded = await firstValueFrom(this.loaded$);

    // Only start to fetching if the store ins't load yet or we are forcing
    if (options?.force === true || !isLoaded) {
      // Emit `loading$` as true
      this._entityCollection.setLoading(true);

      // Check if we need to clear the current cache
      if (options?.clearCache === true) {
        this._clearCache();
        // The `loaded$` state will only change if we clear the cache
        this._entityCollection.setLoaded(false);
      }

      // If the request falls means that the token expired or the user doesn't exist anymore, then logged user will be set to `null`
      await this._usersClient.getMe();

      const usersE = await this._usersClient.getAll();
      pipe(
        usersE,
        foldW(
          () => void 0,
          users => {
            this._entityCollection.upsertManyInCache([...users]);

            // * Update load state
            this._entityCollection.setLoading(false);
            this._entityCollection.setLoaded(true);
          },
        ),
      );
    }
  }

  /**
   * Update a user in the database and when returns success also update in local cache.
   *
   * PS: Only an admin can create another user
   *
   * @param creatableUser - The user's data to update
   * @returns A either containing the error or the updated user
   */
  public async create(creatableUser: CreatableUser): Promise<Either<Error, User>> {
    // Update user
    const either = await this._usersClient.createOne(creatableUser);

    // Add to cache
    if (isRight(either)) {
      this._entityCollection.upsertOneInCache(either.right);
    }

    return either;
  }

  /**
   * Update a user in the database and when returns success also update in local cache.
   *
   * @param updatableUser - The user's data to update
   * @returns A either containing the error or the updated user
   */
  public async update(updatableUser: UpdatableUser): Promise<Either<Error, User>> {
    // Update user
    const either = await this._usersClient.updateOne(updatableUser);

    // Add to cache
    if (isRight(either)) {
      this._entityCollection.upsertOneInCache(either.right);
    }

    return either;
  }

  /**
   * Delete a user from the database and the state
   *
   * PS: Only an admin can delete another user
   *
   * @param assetID - The user ID to delete
   * @returns A either containing the error or void on success
   */
  public async delete(assetID: string): Promise<Either<Error, void>> {
    const either = await this._usersClient.deleteOne(assetID);

    // Remove from cache
    if (isRight(either)) {
      this._entityCollection.removeOneFromCache(assetID);
    }

    return either;
  }

  /**
   * `Observable` that emits all the users in the store's cache and emits again when the cache
   * changes.
   */
  public getAll(): Observable<List<User>> {
    return this._entityCollection.entities$.pipe(map(List), shareReplay({ bufferSize: 1, refCount: false }));
  }

  /**
   * `Observable` that search an user with the given ID in the store's cache and emits again
   * when the cache changes.
   */
  public getOne(id: string): Observable<User | null> {
    return this._entityCollection.entityMap$.pipe(
      map(dictionary => dictionary[id] ?? null),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  /** Clear all the data saved in the cache */
  private _clearCache(): void {
    this._entityCollection.clearCache();
  }
}
