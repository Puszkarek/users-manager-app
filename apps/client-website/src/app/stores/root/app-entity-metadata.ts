import { sortByName } from '@front/app/utils';
import { EntityMetadataMap } from '@ngrx/data';

import { USER_ENTITY_NAME, USER_ENTITY_PLURAL_NAME } from './entity-names';

export const appEntityMetadata: EntityMetadataMap = {
  [USER_ENTITY_NAME]: {
    entityDispatcherOptions: { optimisticAdd: true, optimisticUpdate: true },

    entityName: USER_ENTITY_NAME,
    sortComparer: sortByName,
  },
};

export const entityPluralNames = {
  [USER_ENTITY_NAME]: USER_ENTITY_PLURAL_NAME,
};
