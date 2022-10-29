import { EntityMetadataMap } from '@ngrx/data';
import { sortByName } from '@front/utils';

import { userEntityName, userEntityPluralName } from './entity-names';

export const appEntityMetadata: EntityMetadataMap = {
  [userEntityName]: {
    entityDispatcherOptions: { optimisticAdd: true, optimisticUpdate: true },

    entityName: userEntityName,
    sortComparer: sortByName,
  },
};

export const entityPluralNames = {
  [userEntityName]: userEntityPluralName,
};
