import { Test, TestingModule } from '@nestjs/testing';
import { FakeMailProvider } from '@server/infra/providers/fake-mail';
import { FakeUsersRepository } from '@server/infra/repositories/users';
import { UsersService } from '@server/infra/services';

import { UsersController } from './users.controller';

describe(UsersController.name, () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: new UsersService(new FakeUsersRepository(), new FakeMailProvider()),
        },
      ],
    }).compile();
  });

  it('should create the controller', () => {
    const appController = app.get<UsersController>(UsersController);

    expect(appController).toBeTruthy();
  });
});
