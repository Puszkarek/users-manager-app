/* eslint-disable functional/no-throw-statement */
/* eslint-disable functional/prefer-readonly-type */
import { Injectable } from '@angular/core';
import { UsersClient } from '@front/clients';
import { User } from '@front/interfaces';
import { userEntityName } from '@front/stores';
import { EntityCollectionDataService, Logger, QueryParams } from '@ngrx/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
/*
 * TODO (store): use guards here?
 * TODO (try to delete it): I don't need that, and it's hard to customize, after remove I can import directly from
 */
export class UsersDataService implements EntityCollectionDataService<Readonly<User>> {
  public readonly name = userEntityName;

  constructor(private readonly _usersClient: UsersClient, logger: Logger) {
    logger.log('Created custom User EntityDataService');
  }

  // * Edit Methods
  public add(entity: unknown): Observable<User> {
    throw new Error(`Not implemented yet ${entity}`);
  }

  public update(entity: unknown): Observable<User> {
    throw new Error(`Not implemented yet ${entity}`);
  }

  public delete(entityID: string): Observable<string> {
    throw new Error(`Not implemented yet ${entityID}`);
  }

  public upsert(entity: unknown): Observable<User> {
    throw new Error(`Not implemented ${entity}`);
  }

  // * Get Methods
  public getAll(): Observable<Array<User>> {
    return this._usersClient.getAll();
  }

  public getById(id: string): Observable<User> {
    return this._usersClient.getOne(id);
  }

  public getWithQuery(parameters: string | QueryParams): Observable<Array<User>> {
    throw new Error(`Not implemented ${parameters.normalize}`);
  }
}
