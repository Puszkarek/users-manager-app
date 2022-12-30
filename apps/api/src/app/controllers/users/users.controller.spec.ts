import { Test, TestingModule } from '@nestjs/testing';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { FakeMailProvider } from '@server/infra/providers/fake-mail';
import { FakeUsersRepository } from '@server/infra/repositories/users';
import { makeUsersService } from '@server/infra/services';

import { UsersController } from './users.controller';

describe(UsersController.name, () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: USERS_SERVICE_INJECTABLE_TOKEN,
          useValue: new makeUsersService(new FakeUsersRepository(), new FakeMailProvider()),
        },
      ],
    }).compile();
  });

  it('should create the controller', () => {
    const appController = app.get<UsersController>(UsersController);

    expect(appController).toBeTruthy();
  });
});
