import { ExceptionError, REQUEST_STATUS } from '@server/infra/interfaces';
import { isError } from 'lodash';

export const extractError = (value: unknown): Error => {
  if (isError(value)) {
    return value;
  }
  return new Error('Unknown Error');
};

export const createExceptionError = (message: string, statusCode: REQUEST_STATUS): ExceptionError => ({
  message,
  statusCode,
});
