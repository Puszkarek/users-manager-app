import { EntityCollectionServiceBase, EntitySelectors$ } from '@ngrx/data';
import { Either } from 'fp-ts/lib/Either';
import { List } from 'immutable';
import { Observable } from 'rxjs';

/** Parameters that can be passed to the `load` method of a {@link Store} */
export type StoreLoadOptions = {
  /** When true forces the store load ever if the store already has been initialized before */
  readonly force?: boolean;
  /** True if you want to clear the cache while loading */
  readonly clearCache?: boolean;
};

/**
 * An abstraction to all the methods that an store should have
 *
 * P.S: I'm starting to think that it's not necessary, may be deleted when I have to create a
 * new store
 */
export type Store<Asset, UpdatableAsset, CreatableAsset> = {
  // * Helpers
  readonly count$: Observable<number>;

  readonly loaded$: Observable<boolean>;
  readonly loading$: Observable<boolean>;

  readonly load: (options?: StoreLoadOptions) => Promise<void>;

  // * Editing operations
  readonly update: (updatableAsset: UpdatableAsset) => Promise<Either<Error, Asset>>;
  readonly delete: (id: string) => Promise<Either<Error, void>>;
  readonly create: (creatableAsset: CreatableAsset) => Promise<Either<Error, Asset>>;

  // * Getters operations
  readonly getOne: (id: string) => Observable<Asset | null>;
  readonly getAll: () => Observable<List<Asset>>;

  // TODO: add filters? getManyWithFilter?
};

/**
 * This project will not use the data-service to create a better environment to fit with fp-ts
 * library, so to avoid mistakes this interface will remove the non-implemented methods from
 * the EntityCollection
 */
export type TypedEntityCollectionService<T> = Omit<
  EntityCollectionServiceBase<T, EntitySelectors$<T>>,
  'update' | 'add' | 'delete' | 'getAll' | 'getByKey' | 'getWithQuery'
>;
