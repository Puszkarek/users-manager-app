/** This is not a production server yet! This is only a minimal backend to get started. */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const DEFAULT_SERVER_PORT = 3333;
const GLOBAL_PREFIX = 'api';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: environment.origin,
    },
  });
  app.setGlobalPrefix(GLOBAL_PREFIX);
  const port = process.env['PORT'] ?? DEFAULT_SERVER_PORT;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`);
};

bootstrap();
