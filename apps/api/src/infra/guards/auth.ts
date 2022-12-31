import { parseRawToken } from '@server/infra/helpers/token';
import { ExceptionError, UsersService } from '@server/infra/interfaces';
import { Request } from 'express';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';

// * Interface of the validate method
type MakeIsRequestAuthenticated = (
  usersService: UsersService,
) => (request: Request) => TaskEither<ExceptionError, void>;

export const makeIsRequestAuthenticated: MakeIsRequestAuthenticated = ({ token: { validate } }) => {
  // * Validate the request
  return request => {
    return pipe(
      // * Parse the raw token
      parseRawToken(request.header('Authorization')),
      TE.fromEither,
      // * Validate the token
      TE.chain(validate),
    );
  };
};
