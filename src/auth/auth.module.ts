import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE', // Este token debe coincidir con el que se inyecta en el controlador
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [UsersController],
})
export class AuthModule {}
// http://localhost:3000/juan123/login?password=password123
