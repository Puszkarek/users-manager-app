import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('ping')
  public ping(): string {
    return 'pong';
  }
}
