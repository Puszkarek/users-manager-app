import { ExceptionError, REQUEST_STATUS } from '@server/infra/interfaces';
import { option as O } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { isError } from 'lodash';

export const extractError = (value: unknown): Error => {
  return pipe(
    value,
    O.fromPredicate(isError),
    O.getOrElse(() => new Error('Unknown Error')),
  );
};

export const createExceptionError = (message: string, statusCode: REQUEST_STATUS): ExceptionError => ({
  message,
  statusCode,
});
