import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  const logger = new Logger('API GAWAY');
  logger.log('API Running');
}
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Error during bootstrap', error);
});
