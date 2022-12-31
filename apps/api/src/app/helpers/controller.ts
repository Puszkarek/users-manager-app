import { CustomDecorator, HttpException, SetMetadata } from '@nestjs/common';
import { PUBLIC_ROUTE_KEY } from '@server/app/constants/guard';
import { ExceptionError } from '@server/infra/interfaces';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Task } from 'fp-ts/lib/Task';
import { TaskEither } from 'fp-ts/lib/TaskEither';

/**
 * On FP patterns we don't throw errors, but Nest depends of that to send the correct HTTP
 * Status code to the front-end, so we are doing this little abstraction to handle the errors
 *
 * P.S: should be called only on nest controllers, guards, etc...
 *
 * @param taskE - The either task to execute and get the response
 * @returns `T` if is a Right, otherwise throw an `HttpException` error with left
 */
export const executeTaskEither = <T>(taskE: TaskEither<ExceptionError, T>): Task<T> => {
  return pipe(
    taskE,
    TE.getOrElse(error => {
      // eslint-disable-next-line functional/no-throw-statement
      throw new HttpException(error.message, error.statusCode);
    }),
  );
};

/**
 * A Decorator to say to the AuthGuard that the endpoint is public
 *
 * To use it put as a decorator at the controller method that you want to be public
 */
export const IsPublic = (): CustomDecorator<string> => SetMetadata(PUBLIC_ROUTE_KEY, true);
