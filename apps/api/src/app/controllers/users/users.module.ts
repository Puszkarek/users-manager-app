import { Module } from '@nestjs/common';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { usersService } from '@server/app/services/users.service';

import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USERS_SERVICE_INJECTABLE_TOKEN,
      useValue: usersService,
    },
  ],
})
export class UsersModule {}
