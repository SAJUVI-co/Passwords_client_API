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
  // NotFoundException,
  // NotAcceptableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users') // Prefijo para las rutas
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly userServiceClient: ClientProxy, // Cliente del microservicio
  ) {}

  // POST /users
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = this.userServiceClient.send('createUser', createUserDto);

      return newUser;
    } catch (error) {
      // console.log(newUser);
      // console.log(error);
      return new NotFoundException(error);
    }
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  @Get()
  findAllUsers() {
    return this.userServiceClient.send({ cmd: 'findAllUsers' }, {});
  }

  // GET /users
  // @Get('test')
  // test() {
  //   const res = this.userServiceClient.send('tests', {});
  //   if (!res) return new NotAcceptableException('Error del servicio');
  //   return res;
  // }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/sorted-by-creation
  @Get('sorted-by-creation')
  findAllSortedByCreation(@Query('order') order: 'ASC' | 'DESC') {
    return this.userServiceClient.send(
      { cmd: 'findAllSortedByCreation' },
      order,
    );
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/sorted-by-update
  @Get('sorted-by-update')
  findAllSortedByUpdate(@Query('order') order: 'ASC' | 'DESC') {
    return this.userServiceClient.send({ cmd: 'findAllSortedByUpdate' }, order);
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/online
  @Get('online')
  findOnlineUsers() {
    return this.userServiceClient.send({ cmd: 'findOnlineUsers' }, {});
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/role
  @Get('role')
  findUsersByRole(@Query('role') role: UserRole) {
    return this.userServiceClient.send({ cmd: 'findUsersByRole' }, role);
  }

  // Post /users/login
  @Post('login')
  findOneUser(@Body() loginUserDto: LoginUserDto) {
    return this.userServiceClient.send('login', loginUserDto);
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
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
