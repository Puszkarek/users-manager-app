import { Module } from '@nestjs/common';
import { UsersModule } from '@server/app/controllers/users';

import { AppController } from './app.controller';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
})
export class AppModule {}
