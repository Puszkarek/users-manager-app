import { Controller, Get } from '@nestjs/common';

import { WELCOME_MESSAGE } from './constants/common';
import { IsPublic } from './helpers/controller';

@Controller()
export class AppController {
  @IsPublic()
  @Get()
  public sendMessage(): {
    readonly message: string;
  } {
    return { message: WELCOME_MESSAGE };
  }
}
