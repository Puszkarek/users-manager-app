import { CreatableUser, ID, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { createExceptionError, extractError } from '@server/infra/helpers';
import {
  ExceptionError,
  IMailProvider,
  IUsersRepository,
  IUsersService,
  REQUEST_STATUS,
} from '@server/infra/interfaces';
import { Either, left, right } from 'fp-ts/lib/Either';
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
      try {
        await this._usersRepository.delete(id);
        return right(void 0);
      } catch (error: unknown) {
        return left(createExceptionError(extractError(error).message, REQUEST_STATUS.bad));
      }
    },
  };

  public get = {
    all: async (): Promise<Either<ExceptionError, ReadonlyArray<User>>> => {
      return right(await this._usersRepository.all());
    },
    one: async (id: ID): Promise<Either<ExceptionError, User>> => {
      const foundedUser = await this._usersRepository.findByID(id);

      if (isNull(foundedUser)) {
        return left(createExceptionError('User not found with the given ID', REQUEST_STATUS.not_found));
      }

      return right(foundedUser);
    },
  };

  public login = {
    one: async ({ email, password }: LoginRequest): Promise<Either<ExceptionError, LoginResponse>> => {
      try {
        const foundedUser = await this._usersRepository.findByEmail(email);
        if (!foundedUser) {
          return left(createExceptionError('No user found with the given Email', REQUEST_STATUS.not_found));
        }

        const isGivenPasswordValid = await this._usersRepository.isUserPasswordValid(foundedUser.id, password);

        if (!isGivenPasswordValid) {
          return left(createExceptionError('The given password is wrong', REQUEST_STATUS.bad));
        }

        return right({
          loggedUser: foundedUser,
          token: password,
        });
      } catch (error: unknown) {
        return left(createExceptionError(extractError(error).message, REQUEST_STATUS.bad));
      }
    },
  };

  public update = {
    one: async (data: UpdatableUser): Promise<Either<ExceptionError, User>> => {
      try {
        const { password, ...updatableUser } = data;
        const currentUser = await this._usersRepository.findByID(updatableUser.id);
        if (!currentUser) {
          return left(createExceptionError('No user found with the given email', REQUEST_STATUS.not_found));
        }

        // TODO: validade the current password

        const updatedUser: User = { ...currentUser, ...updatableUser };
        await this._usersRepository.update(updatedUser, password);
        return right(updatedUser);
      } catch (error: unknown) {
        return left(createExceptionError(extractError(error).message, REQUEST_STATUS.bad));
      }
    },
  };

  constructor(private readonly _usersRepository: IUsersRepository, private readonly _mailProvider: IMailProvider) {}
}
