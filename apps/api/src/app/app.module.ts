import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { USERS_SERVICE_INJECTABLE_TOKEN } from '@server/app/constants/user.constant';
import { UsersModule } from '@server/app/controllers/users';
import { AuthGuard } from '@server/app/guards/auth/auth.guard';
import { usersService } from '@server/app/services/user.service';

import { AppController } from './app.controller';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [
    {
      provide: USERS_SERVICE_INJECTABLE_TOKEN,
      useValue: usersService(),
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
