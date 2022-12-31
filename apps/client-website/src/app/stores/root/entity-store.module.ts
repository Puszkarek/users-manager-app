import { NgModule } from '@angular/core';
import { DefaultDataServiceConfig, EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { appEntityMetadata, entityPluralNames } from './app-entity-metadata';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
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
