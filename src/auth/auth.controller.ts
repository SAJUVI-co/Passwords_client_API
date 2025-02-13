import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  Inject,
  NotFoundException,
  // NotAcceptableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';

@Controller('users') // Prefijo para las rutas
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly userServiceClient: ClientProxy, // Cliente del microservicio
  ) {}

  // POST /users
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    const exist_user = this.userServiceClient.send('createUser', createUserDto);
    if (exist_user) return new NotFoundException('Este usuario ya existe');
    return exist_user;
  }

  // @Get()
  // findAllUsers() {
  //   return 'hola mundo';
  // }

  // GET /users
  // @Get('test')
  // test() {
  //   const res = this.userServiceClient.send('tests', {});
  //   if (!res) return new NotAcceptableException('Error del servicio');
  //   return res;
  // }

  // GET /users/sorted-by-creation
  @Get('sorted-by-creation')
  findAllSortedByCreation(@Query('order') order: 'ASC' | 'DESC') {
    return this.userServiceClient.send(
      { cmd: 'findAllSortedByCreation' },
      order,
    );
  }

  // GET /users/sorted-by-update
  @Get('sorted-by-update')
  findAllSortedByUpdate(@Query('order') order: 'ASC' | 'DESC') {
    return this.userServiceClient.send({ cmd: 'findAllSortedByUpdate' }, order);
  }

  // GET /users/online
  @Get('online')
  findOnlineUsers() {
    return this.userServiceClient.send({ cmd: 'findOnlineUsers' }, {});
  }

  // GET /users/role
  @Get('role')
  findUsersByRole(@Query('role') role: UserRole) {
    return this.userServiceClient.send({ cmd: 'findUsersByRole' }, role);
  }

  // GET /users/:username/login
  @Get(':username/login')
  findOneUser(
    @Param('username') username: string,
    @Query('password') password: string,
  ) {
    return this.userServiceClient.send('findOneUser', { username, password });
  }

  // GET /users/deleted
  @Get('deleted')
  findDeletedUsers() {
    return this.userServiceClient.send({ cmd: 'findDeletedUsers' }, {});
  }

  // PATCH /users
  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userServiceClient.send('updateUser', updateUserDto);
  }

  // PATCH /users/online-status
  @Patch('online-status')
  updateOnlineStatus(@Body() data: { userId: number; status: boolean }) {
    return this.userServiceClient.send({ cmd: 'updateOnlineStatus' }, data);
  }

  // DELETE /users/:id
  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.userServiceClient.send('removeUser', id);
  }
}
