import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  public sendMessage(): string {
    return 'Welcome to the api!';
  }
}
