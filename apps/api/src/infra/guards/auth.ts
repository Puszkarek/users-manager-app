import { parseRawToken } from '@server/infra/helpers/token';
import { ExceptionError, UsersOperations } from '@server/infra/interfaces';
import { Request } from 'express';
import { taskEither } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

// * Interface of the validate method
type MakeIsRequestAuthenticated = (
  usersService: UsersOperations,
) => (request: Request) => taskEither.TaskEither<ExceptionError, void>;

export const makeIsRequestAuthenticated: MakeIsRequestAuthenticated = ({ token: { validate } }) => {
  // * Validate the request
  return request => {
    return pipe(
      // * Parse the raw token
      parseRawToken(request.header('Authorization')),
      taskEither.fromEither,
      // * Validate the token
      taskEither.chain(validate),
    );
  };
};
