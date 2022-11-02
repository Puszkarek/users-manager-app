import { isError } from 'lodash';

export const extractError = (value: unknown): Error => {
  if (isError(value)) {
    return value;
  }
  return new Error('Unknown Error');
};
