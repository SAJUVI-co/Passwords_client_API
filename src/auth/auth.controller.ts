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
  InternalServerErrorException,
  UnauthorizedException,
  // UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService, Public } from './auth.service';
import { DateEnum } from './dto/query-user.dto';
import { lastValueFrom } from 'rxjs';
import { UserRole } from './entities/user.entity';

@Controller('users') // Prefijo para las rutas
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly userServiceClient: ClientProxy, // Cliente del microservicio
    @Inject('USERS_CACHE') private readonly cacheClient: ClientProxy,
    private authService: AuthService, // Cliente del microservicio
  ) {}

  //! EL CONTROLADOR PARA LOS USUARIOS DEBE REALIZAR DOS CONSULTAS, UNA PARA EL SERVIIO DEL CACHE Y LA OTRA PARA EL SERVICIO DE USUARIOS

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
  // GET /users/online //!NOT FOUND - SE HA ELIMINADO EL ESTADO DE FORMA TEMPORAL
  // @Get('online')
  // findOnlineUsers(
  //   @Query('skip') skip: number,
  //   @Query('limit') limit: number,
  //   @Query('order') order: 'ASC' | 'DESC',
  // ) {
  //   return this.userServiceClient.send(
  //     { cmd: 'findOnlineUsers' },
  //     { skip, limit, order },
  //   );
  // }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/role
  @Post('role')
  async findUsersByRole(
    @Query('role') role: UserRole,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Query('order') order: 'ASC' | 'DESC',
    @Body() body: UpdateUserDto,
  ) {
    const findUserCache: Promise<any> = await this.authService.verifyPermissions(body.id.toString());

    if (
      findUserCache !== null &&
      findUserCache !== undefined &&
      (await findUserCache).rol === UserRole.INVITE
    ) {
      throw new UnauthorizedException('you dont have access');
    }

    return this.userServiceClient.send(
      { cmd: 'findUsersByRole' },
      { role, skip, limit, order },
    );
  }

  // Post /users/login //!check
  @Post('login')
  async findOneUser(@Body() loginUserDto: LoginUserDto) {
    try {
      // consulta a la DB

      const user: UpdateUserDto = await lastValueFrom(
        this.userServiceClient.send('login', loginUserDto),
      );

      const findUserCache: Promise<any> =
        await this.authService.verifyPermissions(user.id.toString());

      if (findUserCache) return findUserCache;

      // almacena al usuario en el cache
      const newUser = await this.authService.createCache(user);
      // const newUser = await lastValueFrom(newUser$);
      return newUser;
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      throw new InternalServerErrorException(error);
    }
  }

  // Post /users/login //!check
  @Public()
  @Post('token')
  tokenGenerate(@Body() user: { username: string; password: string }) {
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
