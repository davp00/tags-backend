import { NestFactory } from '@nestjs/core';
import { PORT } from './config';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

/** Runs the app */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);

  Logger.log(`Server running on port ${PORT}`, 'APP');
}
bootstrap();
