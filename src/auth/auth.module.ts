import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JWT_SECRET } from 'src/config/envs.config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE', // Este token debe coincidir con el que se inyecta en el controlador
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 5000,
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
// http://localhost:3000/juan123/login?password=password123
