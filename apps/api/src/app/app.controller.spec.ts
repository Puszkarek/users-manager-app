import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { WELCOME_MESSAGE } from './constants/common';

describe(AppController.name, () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();
  });

  describe(AppController.prototype.sendMessage.name, () => {
    it('should return the welcome message', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.sendMessage()).toBe({ message: WELCOME_MESSAGE });
    });
  });
});
