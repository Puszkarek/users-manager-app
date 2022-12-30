import { AuthToken, User } from '@api-interfaces';
import { parseToken } from '@server/infra/helpers/token';
import { MailProvider, UsersRepository, UsersService } from '@server/infra/interfaces';
import {
  makeCreateOne,
  makeDeleteOne,
  makeGetAll,
  makeGetMe,
  makeGetOne,
  makeLoginMe,
  makeRefreshToken,
  makeUpdateOne,
  makeValidateToken,
} from '@server/infra/services/users/operations';
import { taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { TaskOption } from 'fp-ts/lib/TaskOption';
import { isString } from 'lodash';

export const generateUsersService = (usersRepository: UsersRepository, mailProvider: MailProvider): UsersService => {
  /**
   * Parse the given token and try to find an {@link User} with that
   *
   * @param token - The token that belongs to the user
   * @returns An {@link Option} containing the found `User` or nothing
   */
  const findByToken = (token: AuthToken): TaskOption<User> => {
    return pipe(
      // * Parse the token
      token,
      parseToken,
      TO.fromTaskEither,
      // * Extract the `userID` from payload
      TO.chain(({ payload: { userID } }) => TO.fromNullable(isString(userID) ? userID : null)), // TODO: improve validation
      // * Try to find the user
      TO.chain(usersRepository.findByID),
    );
  };

  return {
    create: {
      one: makeCreateOne(usersRepository, mailProvider),
    },
    update: {
      one: makeUpdateOne(usersRepository),
    },
    delete: {
      one: makeDeleteOne(usersRepository, findByToken),
    },
    get: {
      all: makeGetAll(usersRepository),

      one: makeGetOne(usersRepository),

      me: makeGetMe(findByToken),
    },
    login: {
      one: makeLoginMe(usersRepository),
    },
    token: {
      refresh: makeRefreshToken(findByToken),
      validate: makeValidateToken(),
    },
  };
};
