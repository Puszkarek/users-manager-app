import { Module } from '@nestjs/common';
import { FakeMailProvider } from '@server/infra/providers/fake-mail/fake-mail.provider';
import { FakeUsersRepository } from '@server/infra/repositories/users/fake-users.repository';
import { UsersService } from '@server/infra/services';

import { UsersController } from './users.controller';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useValue: new UsersService(new FakeUsersRepository(), new FakeMailProvider()),
    },
  ],
})
export class UsersModule {}
