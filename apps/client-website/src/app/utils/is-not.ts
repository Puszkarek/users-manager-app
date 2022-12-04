import { isNull } from 'lodash-es';

export const isNotNull = <T>(value: T): value is Exclude<T, null> => !isNull(value);
