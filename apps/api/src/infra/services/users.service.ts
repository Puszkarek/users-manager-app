import { CreatableUser, ID, LoginRequest, LoginResponse, UpdatableUser, User } from '@api-interfaces';
import { extractError } from '@server/infra/helpers';
import { IMailProvider, IUsersRepository, IUsersService } from '@server/infra/interfaces';
import { Either, left, right } from 'fp-ts/lib/Either';
import { isNull, uniqueId } from 'lodash';

export class UsersService implements IUsersService {
  public create = {
    one: async (data: CreatableUser): Promise<Either<Error, User>> => {
      const { password, ...creatableUser } = data;
      const foundUser = await this._usersRepository.findByEmail(creatableUser.email);

      if (!isNull(foundUser)) {
        return left(new Error('User already exists'));
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
    one: async (id: ID): Promise<Either<Error, void>> => {
      try {
        await this._usersRepository.delete(id);
        return right(void 0);
      } catch (error: unknown) {
        return left(extractError(error));
      }
    },
  };

  public get = {
    all: async (): Promise<Either<Error, ReadonlyArray<User>>> => {
      return right(await this._usersRepository.all());
    },
    one: async (id: ID): Promise<Either<Error, User>> => {
      const foundedUser = await this._usersRepository.findByID(id);

      if (isNull(foundedUser)) {
        return left(new Error('User not found with the given ID'));
      }

      return right(foundedUser);
    },
  };

  public login = {
    one: async ({ email, password }: LoginRequest): Promise<Either<Error, LoginResponse>> => {
      try {
        const foundedUser = await this._usersRepository.findByEmail(email);
        if (!foundedUser) {
          return left(new Error('No user found with the given Email'));
        }

        const isGivenPasswordValid = await this._usersRepository.isUserPasswordValid(foundedUser.id, password);

        if (!isGivenPasswordValid) {
          return left(new Error('The given password is wrong'));
        }

        return right({
          loggedUser: foundedUser,
          token: password,
        });
      } catch (error: unknown) {
        return left(extractError(error));
      }
    },
  };

  public update = {
    one: async (data: UpdatableUser): Promise<Either<Error, void>> => {
      try {
        const { password, ...updatableUser } = data;
        const currentUser = await this._usersRepository.findByID(updatableUser.id);
        if (!currentUser) {
          return left(new Error('No user found with the given email'));
        }

        // TODO: validade the current password

        await this._usersRepository.update({ ...currentUser, ...updatableUser }, password);
        return right(void 0);
      } catch (error: unknown) {
        return left(extractError(error));
      }
    },
  };

  constructor(private readonly _usersRepository: IUsersRepository, private readonly _mailProvider: IMailProvider) {}

  public demo(): string {
    console.log('here');
    return 'It WORKS';
  }
}
