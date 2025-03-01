import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Inject,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService, Public } from './auth.service';
import { DateEnum } from './dto/query-user.dto';

@Controller('users') // Prefijo para las rutas
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly userServiceClient: ClientProxy, // Cliente del microservicio
    private authService: AuthService, // Cliente del microservicio
  ) {}

  // POST /users
  @Public()
  @Post() //!check
  createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = this.userServiceClient.send('createUser', createUserDto);
      return newUser;
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO

  @Get()
  findAllUsers(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: string,
    @Query('order', new DefaultValuePipe('ASC')) order: string,
    @Body() loginUserDto: LoginUserDto,
  ) {
    return this.userServiceClient.send(
      { cmd: 'findAllUsers' },
      { skip, limit, order, loginUserDto },
    );
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/sorted-by-creation
  @Get('sorted-by-date')
  findAllSortedByDate(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Query('order') order: 'ASC' | 'DESC',
    @Query('date') date: DateEnum,
  ) {
    return this.userServiceClient.send(
      { cmd: 'findAllSortedByDate' },
      { skip, limit, order, date },
    );
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/online //!check

  @Get('online')
  findOnlineUsers(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Query('order') order: 'ASC' | 'DESC',
  ) {
    return this.userServiceClient.send(
      { cmd: 'findOnlineUsers' },
      { skip, limit, order },
    );
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/role
  @Get('role')
  findUsersByRole(
    @Query('role') role: UserRole,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Query('order') order: 'ASC' | 'DESC',
  ) {
    return this.userServiceClient.send(
      { cmd: 'findUsersByRole' },
      { role, skip, limit, order },
    );
  }

  // Post /users/login //!check
  @HttpCode(HttpStatus.OK)
  @Post('login')
  findOneUser(@Body() loginUserDto: LoginUserDto) {
    const user = this.userServiceClient.send('login', loginUserDto);
    return user;
  }

  // Post /users/login //!check
  @Public()
  @Post('token')
  tokenGenerate(@Body() user) {
    const token = this.authService.jsonwebToken(user);
    return token;
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

  // Soft Delete /users/:id
  @Delete('delete-User')
  deleteUser(@Body('id') id: number) {
    return this.userServiceClient.send('deleteUser', id);
  }

  // DELETE /users/:id
  @Delete('remove-User')
  removeUser(@Body('id') id: number) {
    return this.userServiceClient.send('removeUser', id);
  }
}
