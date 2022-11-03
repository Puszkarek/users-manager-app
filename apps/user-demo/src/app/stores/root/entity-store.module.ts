import { NgModule } from '@angular/core';
import { DefaultDataServiceConfig, EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { appEntityMetadata, entityPluralNames } from './app-entity-metadata';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: 'http://localhost:3333/api/', // TODO (env): get from environment.ts
  timeout: 3000, // Request timeout
};

@NgModule({
  imports: [
    StoreModule.forRoot([]),
    EffectsModule.forRoot(),
    EntityDataModule.forRoot({
      entityMetadata: appEntityMetadata,
      pluralNames: entityPluralNames,
    }),
  ],
  providers: [{ provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }],
})
export class EntityStoreModule {}
