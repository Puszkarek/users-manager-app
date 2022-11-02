import { Either } from 'fp-ts/lib/Either';
import { List } from 'immutable';
import { Observable } from 'rxjs';

export type StoreLoadOptions = {
  readonly force?: boolean;
  readonly clearCache?: boolean;
};

export type IStore<Asset = unknown, UpdatableAsset = unknown, CreatableAsset = unknown> = {
  // * Helpers
  readonly count$: Observable<number>;

  readonly loaded$: Observable<boolean>;
  readonly loading$: Observable<boolean>;

  readonly load: (options?: StoreLoadOptions) => Promise<void>;

  // * Editing operations
  readonly update: (updatableAsset: UpdatableAsset) => Promise<Either<Error, Asset>>;
  readonly delete: (id: string) => Promise<Either<Error, string>>;
  readonly create: (creatableAsset: CreatableAsset) => Promise<Either<Error, Asset>>;

  // * Getters operations
  readonly getOne: (id: string) => Observable<Asset | null>;
  readonly getAll: () => Observable<List<Asset>>;

  // TODO: add filters? getManyWithFilter?
};
