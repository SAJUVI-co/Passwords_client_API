import { Module } from '@nestjs/common';
import { ClavesController } from './claves.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLAVES_SERVICE', // Este token debe coincidir con el que se inyecta en el controlador
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 5001,
        },
      },
    ]),
  ],
  controllers: [ClavesController],
})
export class ClavesModule {}
