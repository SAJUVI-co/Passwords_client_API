import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { ClavesModule } from './claves/claves.module';

class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

@Module({
  imports: [LoggerModule, AuthModule, ClavesModule],
})
export class AppModule {}
