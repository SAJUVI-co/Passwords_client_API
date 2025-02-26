import {
  Controller,
  Post,
  Body,
  Inject,
  NotFoundException,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserClaveDto } from './dto/create-clave.dto';

@Controller('claves')
export class ClavesController {
  constructor(
    @Inject('CLAVES_SERVICE') private readonly userServiceClient: ClientProxy, // Cliente del microservicio
  ) {}

  @Post()
  createUser(@Body() createClaveDto: CreateUserClaveDto) {
    try {
      const newUser = this.userServiceClient.send(
        { cmd: 'createUser' },
        createClaveDto,
      );
      return newUser;
    } catch (error: any) {
      return new NotFoundException(error);
    }
  }

  @Get('/all') // Get all users with filters
  findAllUsersF(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: string,
    @Query('order', new DefaultValuePipe('ASC')) order: string,
  ) {
    try {
      const users = this.userServiceClient.send(
        { cmd: 'findAllUsers' },
        { skip, limit, order },
      );
      return users;
    } catch (error: any) {
      return new NotFoundException(error);
    }
  }

  @Get('/all/w') // Get all deleted users
  findAllW(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: string,
    @Query('order', new DefaultValuePipe('ASC')) order: string,
  ) {
    try {
      const users = this.userServiceClient.send(
        { cmd: 'findAllDeletedUsers' },
        { skip, limit, order },
      );
      return users;
    } catch (error: any) {
      return new NotFoundException(error);
    }
  }

  @Get('/one/:id') // Get one user by id
  findOneU(@Param('id') id: string) {
    try {
      const user = this.userServiceClient.send({ cmd: 'findOneUser' }, { id });
      return user;
    } catch (error: any) {
      return new NotFoundException(error);
    }
  }

  @Patch('/d/:id') // Soft delete user
  softDelUse(@Param('id') id: string) {
    try {
      const user = this.userServiceClient.send({ cmd: 'SD_user' }, { id });
      return user;
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  @Delete('/d/:id') // Delete user
  rm_user(@Param('id') id: string) {
    try {
      const user = this.userServiceClient.send({ cmd: 'DEL_use' }, { id });
      return user;
    } catch (error: any) {
      return new NotFoundException(error);
    }
  }

  @Patch('/r/:id') // Restore user
  res_user(@Param('id') id: string) {
    try {
      const user = this.userServiceClient.send({ cmd: 'res_User' }, { id });
      return user;
    } catch (error: any) {
      return new NotFoundException(error);
    }
  }
}
