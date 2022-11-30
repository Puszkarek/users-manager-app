import { createExceptionError } from '@server/infra/helpers/error.helper';
import { ExceptionError, REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { IUsersService } from '@server/infra/interfaces/users.interface';
import { Request } from 'express';
import { Either, left } from 'fp-ts/lib/Either';
import { isEmpty, isUndefined } from 'lodash';

type MakeIsRequestAuthenticated = (
  usersService: IUsersService,
) => (request: Request) => Promise<Either<ExceptionError, void>>;
export const makeIsRequestAuthenticated: MakeIsRequestAuthenticated = ({ token: { validate } }) => {
  return async request => {
    const authToken = request.header('Authorization')?.split(' ')[1]; // TODO: move to another helper

    // TODO: improve it with a pipe or some guard
    if (isUndefined(authToken) || isEmpty(authToken)) {
      return left(createExceptionError('Missing authentication token', REQUEST_STATUS.unauthorized));
    }

    const either = await validate(authToken);
    return either;
  };
};
