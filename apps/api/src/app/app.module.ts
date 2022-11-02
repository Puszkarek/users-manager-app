import { HttpClientModule } from '@angular/common/http';
import { Module } from '@nestjs/common';
import { UsersModule } from '@server/app/controllers/users.module';

@Module({
  imports: [UsersModule, HttpClientModule],
})
export class AppModule {}
