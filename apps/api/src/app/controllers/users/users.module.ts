import { Module } from '@nestjs/common';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { FakeMailProvider } from '@server/infra/providers/fake-mail/fake-mail.provider';
import { FakeUsersRepository } from '@server/infra/repositories/users/fake-users.repository';
import { UsersService } from '@server/infra/services';

import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USERS_SERVICE_INJECTABLE_TOKEN,
      useValue: new UsersService(new FakeUsersRepository(), new FakeMailProvider()),
    },
  ],
})
export class UsersModule {}
