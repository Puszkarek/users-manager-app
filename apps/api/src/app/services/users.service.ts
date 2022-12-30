import { makeUsersService } from '@server/infra/factories/user';
import { FakeMailProvider } from '@server/infra/providers';
import { FakeUsersRepository } from '@server/infra/repositories';

export const usersService = makeUsersService(new FakeUsersRepository(), new FakeMailProvider());
