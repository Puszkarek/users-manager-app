import { generateUsersService } from '@server/infra/factories/user';
import { generateFakeMailProvider } from '@server/infra/providers';
import { generateFakeUsersRepository } from '@server/infra/repositories';

export const usersService = generateUsersService(generateFakeUsersRepository(), generateFakeMailProvider());
