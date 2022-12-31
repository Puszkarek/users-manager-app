import { Test, TestingModule } from '@nestjs/testing';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { generateFakeMailProvider } from '@server/infra/providers/fake-mail';
import { generateFakeUsersRepository } from '@server/infra/repositories/users';
import { generateUsersService } from '@server/infra/services/users';

import { UsersController } from './users.controller';

describe(UsersController.name, () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: USERS_SERVICE_INJECTABLE_TOKEN,
          useValue: generateUsersService(generateFakeUsersRepository(), generateFakeMailProvider()),
        },
      ],
    }).compile();
  });

  it('should create the controller', () => {
    const appController = app.get<UsersController>(UsersController);

    expect(appController).toBeTruthy();
  });
});
