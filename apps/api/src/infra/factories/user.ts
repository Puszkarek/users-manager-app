import { FakeMailProvider } from '@server/infra/providers/fake-mail';
import { FakeUsersRepository } from '@server/infra/repositories/users';
import { UsersService } from '@server/infra/services';

const makeUserService = (): (() => UsersService) => {
  const usersService = new UsersService(new FakeUsersRepository(), new FakeMailProvider());

  return (): UsersService => usersService;
};

export { makeUserService };
