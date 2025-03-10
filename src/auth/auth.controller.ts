import {
  Controller,
  // Get,
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
  ForbiddenException,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService, Public } from './auth.service';
// import { DateEnum } from './dto/query-user.dto';
import { lastValueFrom } from 'rxjs';
import { LoginGuard } from './guards/password.guard';
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
  @Public() // permite el acceso sin el token
  @Post() //!check
  @UseGuards(LoginGuard)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  //! Check
  // Ejemplo de entrada
  //   {
  //     "id": 66,
  //     "username": "1005210392",
  //     "password": "123456789"
  // }
  @HttpCode(200)
  @Post('all')
  async findAllUsers(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('order', new DefaultValuePipe('ASC')) order: 'ASC' | 'DESC',
    @Body() body: UserDto,
  ) {
    // const user: UpdateUserDto = await lastValueFrom(
    //   this.userServiceClient.send('login', loginUserDto),
    // );

    // ejemplo de entrada:
    // {
    //     "id": 5,
    //     "username": "ju65412sdf23",
    //     "password": "password123",
    //     "email": "juan@exdfmple.com",
    //     "email_recuperacion": "juan@exdfmple.com",
    //     "rol": "admin",
    //     "online": true,
    //     "created_at": "2025-02-17T15:58:45.609Z",
    //     "updated_at": "2025-03-06T02:42:37.000Z",
    //     "deleted_at": null
    // }

    // salida exitosa:
    // [
    //   [
    //       {
    //           "id": 5,
    //           "username": "ju65412sdf23",
    //           "email": "juan@exdfmple.com",
    //           "email_recuperacion": "juan@exdfmple.com",
    //           "rol": "admin",
    //           "online": false,
    //           "created_at": "2025-02-17T15:58:45.609Z",
    //           "updated_at": "2025-03-06T14:56:33.000Z"
    //       },
    //       {
    //           "id": 6,
    //           "username": "example123",
    //           "email": "exampl3e@exdfmple.com",
    //           "email_recuperacion": "exampl3e@exdfmple.com",
    //           "rol": "invite",
    //           "online": false,
    //           "created_at": "2025-02-17T20:32:14.150Z",
    //           "updated_at": "2025-02-17T20:32:14.150Z"
    //       },
    //       {
    //           "id": 17,
    //           "username": "example1234",
    //           "email": "exampl2e@exdfmple.com",
    //           "email_recuperacion": "exampl2e@exdfmple.com",
    //           "rol": "invite",
    //           "online": false,
    //           "created_at": "2025-02-17T20:46:31.621Z",
    //           "updated_at": "2025-02-17T20:46:31.621Z"
    //       },
    //   ],
    // ]

    // salida sin token:
    // {
    //     "message": "No token provided",
    //     "error": "Unauthorized",
    //     "statusCode": 401
    // }

    // salida si no hay usarios registrados
    // {
    //     "message": "Not found",
    //     "statusCode": 404
    // }

    return this.authService.findAllUsers(body, {
      skip,
      limit,
      order,
    });
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/sorted-by-creation
  // @Get('sorted-by-date')
  // findAllSortedByDate(
  //   @Query('skip') skip: number,
  //   @Query('limit') limit: number,
  //   @Query('order') order: 'ASC' | 'DESC',
  //   @Query('date') date: DateEnum,
  // ) {
  //   return this.userServiceClient.send(
  //     { cmd: 'findAllSortedByDate' },
  //     { skip, limit, order, date },
  //   );
  // }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/online
  //! THIS METHOD NOT WORK - WAIT THE NEXT SERVICE VERSION
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
  //! THIS METHOD NOT WORK - WAIT THE NEXT SERVICE VERSION
  // GET /users/role
  // @Post('role')
  // async findUsersByRole(
  //   @Query('role') role: UserRole,
  //   @Query('skip') skip: number,
  //   @Query('limit') limit: number,
  //   @Query('order') order: 'ASC' | 'DESC',
  //   @Body() body: UpdateUserDto,
  // ) {
  //   const findUserCache: Promise<any> =
  //     await this.authService.verifyPermissions(body.id.toString());

  //   if ((await findUserCache).rol === UserRole.INVITE) {
  //     throw new UnauthorizedException('you dont have access');
  //   }

  //   console.log('im here');

  //   return this.userServiceClient.send(
  //     { cmd: 'findUsersByRole' },
  //     { role, skip, limit, order },
  //   );
  // }

  // Post /users/login //!check
  // @Post('login/admin')
  // async findOneUserA(@Body() loginUserDto: LoginUserDto) {
  //   try {
  //     // consulta a la DB

  //     const user: UpdateUserDto = await lastValueFrom(
  //       this.userServiceClient.send('login', loginUserDto),
  //     );

  //     // valida el rol
  //     await this.authService.verifyRol(user);

  //     // almacena al usuario en el cache
  //     const newUser = await this.authService.createCache(user);
  //     // const newUser = await lastValueFrom(newUser$);
  //     return newUser;
  //   } catch (error: any) {
  //     console.error('❌ Error en login:', error);
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  @Post('login') //!check
  @UseGuards(LoginGuard) // valida que el campo password y login exista en el body
  findOneUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.findOneUser(loginUserDto);
  }

  // Post /users/login //!check
  @Public() // permite el acceso sin el token
  @Post('token') //!check
  @UseGuards(LoginGuard) // valida que el campo password y login exista en el body
  async tokenGenerate(@Body() user: { username: string; password: string }) {
    const findUser: UpdateUserDto = await lastValueFrom(
      this.userServiceClient.send('login', user),
    );
    if (!findUser) throw new UnauthorizedException();

    const token = this.authService.jsonwebToken(user);
    return token;
  }

  //? SE NECESITAN LOS ROLES PARA DAR ACCEESO A ESTE METODO
  // GET /users/deleted
  // ! METHOD NOT FOUND
  // @Get('deleted')
  // findDeletedUsers() {
  //   return this.userServiceClient.send({ cmd: 'findDeletedUsers' }, {});
  // }

  // Se puede actualizar todo menos el rol y la fecha de eliminacion
  @Patch() //!check
  @UseGuards(LoginGuard) // valida que el campo password y username exista en el body
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    if (!updateUserDto.id || !updateUserDto.info)
      throw new BadRequestException('Some field is required');

    // lanza error si intenta actualizar el rol
    if (updateUserDto.info?.rol !== undefined) {
      throw new UnauthorizedException(
        'You dont have access to change the role',
      );
    }

    const id = updateUserDto.id.toString();

    //Se valida que el usuario este en el cache
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user$ = await lastValueFrom(
      this.cacheClient.send('getUserCache', { id }),
    );

    // si el usuario esta en el cache, envia la info al servicio
    if (user$) {
      // lanza error si alguno de los id no coincide
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        updateUserDto.id === user$.id &&
        updateUserDto.id === updateUserDto.info.id
      )
        throw new ForbiddenException();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (user$.rol !== UserRole.ADMIN)
        throw new UnauthorizedException(
          "You don't have access yo update this user",
        );

      return this.userServiceClient.send('updateUser', updateUserDto.info);
    }

    // Convertir el Observable en una Promise antes de await
    const user: UserDto = await lastValueFrom(
      this.userServiceClient.send('login', {
        username: updateUserDto.username,
        password: updateUserDto.password,
      }),
    );

    console.log(user);

    // lanza error si alguno de los id no coincide
    if (
      updateUserDto.id !== user.id ||
      updateUserDto.id !== updateUserDto.info.id
    )
      throw new ForbiddenException();

    // actualiza el usuario
    return this.userServiceClient.send('updateUser', updateUserDto.info);
  }

  // solo los usuarios admin pueden usar esta ruta
  @Put('/up/r/a') //!check
  @UseGuards(LoginGuard)
  async updateUserA(@Body() updateUserDto: UpdateUserDto) {
    if (!updateUserDto.id) throw new BadRequestException('ID is required');

    const id = updateUserDto.id.toString();

    //Se valida que el usuario este en el cache
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user$ = await lastValueFrom(
      this.cacheClient.send('getUserCache', { id }),
    );

    // si el usuario esta en el cache, envia la info al servicio
    if (user$) {
      // lanza error si alguno de los id no coincide
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        updateUserDto.id !== user$.id
      )
        throw new ForbiddenException('Sorry, something is wrong');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (user$.rol !== UserRole.ADMIN)
        throw new UnauthorizedException(
          "You don't have access yo update this user",
        );

      return this.userServiceClient.send('updateUser', updateUserDto.info);
    }

    // Convertir el Observable en una Promise antes de await
    const user: UserDto = await lastValueFrom(
      this.userServiceClient.send('login', {
        username: updateUserDto.username,
        password: updateUserDto.password,
      }),
    );

    console.log(user);

    // lanza error si alguno de los id no coincide
    if (updateUserDto.id !== user.id)
      throw new ForbiddenException('Sorry, you can do it this');

    // actualiza el usuario
    return this.userServiceClient.send('updateUser', updateUserDto.info);
  }

  // Soft Delete /users/:id
  @Delete('deleteUser')
  @UseGuards(LoginGuard)
  async deleteUser(@Body() userDto: UserDto) {
    const user: UserDto = await lastValueFrom(
      this.userServiceClient.send('login', {
        username: userDto.username,
        password: userDto.password,
      }),
    );

    if (user.id !== userDto.id)
      throw new ForbiddenException('something is wrong');

    const { id } = user;

    return this.userServiceClient.send('removeUser', id);
  }

  // DELETE /users/:id
  // ! NOT WORK - JUST WORK TO V2
  // @Delete('remove-User')
  // async removeUser(@Query() @Body() updateUserDto: UserDto) {
  //   await this.authService.verifyRol(updateUserDto);
  //   return this.userServiceClient.send('removeUser', updateUserDto.id);
  // }
}
