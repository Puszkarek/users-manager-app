/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

const DEFAULT_SERVER_PORT = 3333;

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, {
    cors: {
      // TODO: should be dynamic
      origin: ['http://localhost:4200'],
    },
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env['PORT'] ?? DEFAULT_SERVER_PORT;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
};

bootstrap();
