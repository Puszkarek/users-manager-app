import { NgModule } from '@angular/core';
import { User } from '@api-interfaces';
import { UsersDataService } from '@front/data-services';
import { DefaultDataServiceConfig, EntityDataModule, EntityDataService } from '@ngrx/data';

import { appEntityMetadata, entityPluralNames } from './app-entity-metadata';
import { userEntityName } from './entity-names';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: 'http://localhost:3333/api/', // TODO (env): get from environment.ts
  timeout: 3000, // Request timeout
};

@NgModule({
  imports: [
    EntityDataModule.forRoot({
      entityMetadata: appEntityMetadata,
      pluralNames: entityPluralNames,
    }),
  ],
  providers: [{ provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }, UsersDataService],
})
export class EntityStoreModule {
  constructor(entityDataService: EntityDataService, usersDataService: UsersDataService) {
    entityDataService.registerService<User>(userEntityName, usersDataService);
  }
}
