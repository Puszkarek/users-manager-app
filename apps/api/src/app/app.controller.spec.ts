import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';

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
      expect(appController.sendMessage()).toBe('Welcome to the api!');
    });
  });
});
