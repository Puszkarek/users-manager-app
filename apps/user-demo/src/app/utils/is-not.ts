import { isNull } from 'lodash';

export const isNotNull = <T>(value: T): value is Exclude<T, null> => !isNull(value);
