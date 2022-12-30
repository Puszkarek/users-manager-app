import { FakeMailProvider } from '@server/infra/providers/fake-mail';
import { FakeUsersRepository } from '@server/infra/repositories/users';
import { UsersService } from '@server/infra/services';
import { TokenService } from '@server/infra/services/token';

export const makeUserService = (): (() => UsersService) => {
  const usersService = new UsersService(new FakeUsersRepository(), new TokenService(), new FakeMailProvider());

  return (): UsersService => usersService;
};
