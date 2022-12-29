import { AuthToken } from '@api-interfaces';
import { createExceptionError } from '@server/infra/helpers/error.helper';
import { ExceptionError, REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { either } from 'fp-ts';
import { isEmpty, isString, isUndefined } from 'lodash';

export const parseRawToken = (rawToken: string | undefined): either.Either<ExceptionError, AuthToken> => {
  if (!isString(rawToken)) {
    return either.left(createExceptionError("Value ins't valid", REQUEST_STATUS.bad));
  }

  const [tokenType, authToken] = rawToken.split(' ');

  if (isUndefined(authToken) || isEmpty(authToken) || tokenType !== 'Bearer') {
    return either.left(createExceptionError('Missing authentication token', REQUEST_STATUS.unauthorized));
  }
  return either.right(authToken);
};
