import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';

describe(AppController.name, () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();
  });

  describe(AppController.prototype.ping.name, () => {
    it('should return "pong"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.ping()).toEqual('pong');
    });
  });
});
