import { Controller, Get } from '@nestjs/common';

import { IsPublic } from './helpers/controller';

@Controller()
export class AppController {
  @IsPublic()
  @Get()
  public sendMessage(): string {
    return "Hi, I'm just a human doing human things";
  }
}
