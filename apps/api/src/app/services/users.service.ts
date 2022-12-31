import { generateFakeMailProvider } from '@server/infra/providers';
import { generateFakeUsersRepository } from '@server/infra/repositories';
import { generateUsersService } from '@server/infra/services/users';

export const usersService = generateUsersService(generateFakeUsersRepository(), generateFakeMailProvider());
