import { CreatableUser, ID, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { createExceptionError } from '@server/infra/helpers';
import {
  ExceptionError,
  IMailProvider,
  IUsersRepository,
  IUsersService,
  REQUEST_STATUS,
} from '@server/infra/interfaces';
import { Either, fromOption, isLeft, left, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { isNone } from 'fp-ts/lib/Option';
import { isNull, uniqueId } from 'lodash';

// TODO: remove try catch from here
export class UsersService implements IUsersService {
  public create = {
    one: async (data: CreatableUser): Promise<Either<ExceptionError, User>> => {
      const { password, ...creatableUser } = data;
      const foundUser = await this._usersRepository.findByEmail(creatableUser.email);

      if (!isNull(foundUser)) {
        return left(createExceptionError('User already exists', REQUEST_STATUS.not_found));
      }

      const newUser: User = {
        ...data,
        id: uniqueId(),
      };

      await this._usersRepository.save(newUser, password);

      await this._mailProvider.sendMail({
        body: 'Welcome to App Team',
        from: {
          email: 'team@app.com',
          name: 'App Team',
        },
        subject: 'Registering to App Team',
        to: {
          email: data.email,
          name: data.name,
        },
      });

      return right(newUser);
    },
  };

  public delete = {
    one: async (id: ID): Promise<Either<ExceptionError, void>> => {
      const either = await this._usersRepository.delete(id);
      return either;
    },
  };

  public get = {
    all: async (): Promise<Either<ExceptionError, ReadonlyArray<User>>> => {
      const either = await this._usersRepository.all();
      return either;
    },
    one: async (id: ID): Promise<Either<ExceptionError, User>> => {
      const userOption = await this._usersRepository.findByID(id);

      return pipe(
        userOption,
        fromOption(() => createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found)),
      );
    },
  };

  public login = {
    one: async ({ email, password }: LoginRequest): Promise<Either<ExceptionError, LoginResponse>> => {
      // TODO: improve using pipe
      const userO = await this._usersRepository.findByEmail(email);
      if (isNone(userO)) {
        return left(createExceptionError('No user found with the given Email', REQUEST_STATUS.not_found));
      }

      const isPasswordValidE = await this._usersRepository.isUserPasswordValid(userO.value.id, password);

      if (isLeft(isPasswordValidE)) {
        return left(createExceptionError('The given password is wrong', REQUEST_STATUS.bad));
      }

      return right({
        loggedUser: userO.value,
        token: password,
      });
    },
  };

  public update = {
    one: async (data: UpdatableUser): Promise<Either<ExceptionError, User>> => {
      const { password, ...updatableUser } = data;
      const userO = await this._usersRepository.findByID(updatableUser.id);
      if (isNone(userO)) {
        return left(createExceptionError('No user found with the given email', REQUEST_STATUS.not_found));
      }

      // TODO: validade the current password

      const updatedUser: User = { ...userO.value, ...updatableUser };
      const updateEither = await this._usersRepository.update(updatedUser, password);

      if (isLeft(updateEither)) {
        left(createExceptionError('Something gone wrong updating the user', REQUEST_STATUS.bad));
      }

      return right(updatedUser);
    },
  };

  constructor(private readonly _usersRepository: IUsersRepository, private readonly _mailProvider: IMailProvider) {}
}
