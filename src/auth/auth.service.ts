import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SetMetadata } from '@nestjs/common';
import { JWT_SECRET } from 'src/config/envs.config';
import { UpdateUserDto, UserDto, UserRole } from './dto/update-user.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UserRoleEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USERS_SERVICE') private readonly userServiceClient: ClientProxy, // Cliente del microservicio
    @Inject('USERS_CACHE') private readonly cacheClient: ClientProxy, // Cliente del microservicio
  ) {}

  //TODO Genera un token para cada usuario
  async jsonwebToken(user: {
    username: string;
    password: string;
  }): Promise<{ access_token: string }> {
    const payload = {
      username: user.username,
      email: user.password,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  //TODO verifica el rol usando el body
  async verifyRol(body: UserDto) {
    if (!body || body === null || body === undefined)
      throw new UnauthorizedException(
        'Sorry, you dont have acces to this route',
      );

    const newId: string = body?.id ? body.id.toString() : '1';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const findUserCache: Promise<any> = await this.verifyPermissions(newId);

    if (
      !(await findUserCache) ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (await findUserCache).rol === UserRoleEntity.INVITE
    )
      throw new UnauthorizedException(
        'Sorry, you dont have acces to this route',
      );

    // console.log(await findUserCache);

    return true;
  }

  //TODO verifica el rol usando el id
  async verifyPermissions(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const info = await lastValueFrom(
      this.cacheClient.send('getUserCache', {
        id: id,
      }),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return info;
  }

  //TODO almacena en cache
  async createCache(user: UserDto) {
    return await lastValueFrom(
      this.cacheClient.send<void>('saveCache', {
        id: user.id.toString(),
        data: user,
      }),
    );
  }

  //TODO Crea un usuario
  createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userServiceClient.send('createUser', createUserDto);
      return newUser;
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  //TODO Busca todos los usuarios
  async findAllUsers(
    body: UserDto,
    {
      skip,
      limit,
      order,
    }: {
      skip: number;
      limit: number;
      order: 'ASC' | 'DESC';
    },
  ) {
    await this.verifyRol(body);
    return this.userServiceClient.send(
      { cmd: 'findAllUsers' },
      {
        skip,
        limit,
        order,
        loginUserDto: { username: body.username, password: body.password },
      },
    );
  }

  //TODO Busca un usuario
  async findOneUser(loginUserDto: LoginUserDto) {
    try {
      const user: UserDto = await lastValueFrom(
        this.userServiceClient.send('login', loginUserDto),
      );

      // almacena al usuario en el cache
      const newUser = await this.createCache(user);
      // const newUser = await lastValueFrom(newUser$);
      return newUser;
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      throw new InternalServerErrorException(error);
    }
  }

  //TODO genera un token
  async tokenGenerate(user: LoginUserDto) {
    const findUser: UpdateUserDto = await lastValueFrom(
      this.userServiceClient.send('login', user),
    );
    if (!findUser) throw new UnauthorizedException();

    const token = this.jsonwebToken(user);
    return token;
  }

  //TODO actualiza el usuario
  async updateUser(updateUserDto: UpdateUserDto) {
    const { id, info, username, password } = updateUserDto;

    if (!id || !info || info === undefined)
      throw new BadRequestException('Some field is required');

    const userUptId = info.id.toString();

    this.validateRoleUpdate(info.rol as unknown as UserRoleEntity);

    const userId = id.toString();
    const cachedUser = await this.getUserFromCache(userId);

    if (cachedUser) {
      this.validateUserUpdatePermissions(
        userId,
        userUptId,
        cachedUser.rol as UserRole,
      );
      return this.userServiceClient.send('updateUser', info);
    }

    const authenticatedUser = await this.authenticateUser(username, password);
    this.validateUserUpdatePermissions(
      userId,
      userUptId,
      authenticatedUser.rol as UserRole,
    );

    return this.userServiceClient.send('updateUser', info);
  }

  //? Función auxiliar para validar intento de actualización de rol
  private validateRoleUpdate(role?: UserRoleEntity) {
    if (role !== undefined) {
      throw new UnauthorizedException(
        'You dont have access to change the role',
      );
    }
  }

  //? Función auxiliar para obtener usuario del caché
  private async getUserFromCache(id: string): Promise<UserDto | null> {
    return lastValueFrom(this.cacheClient.send('getUserCache', { id }));
  }

  //? Función auxiliar para autenticar al usuario en caso de no estar en caché
  private async authenticateUser(
    username: string,
    password: string,
  ): Promise<UserDto> {
    return lastValueFrom(
      this.userServiceClient.send('login', { username, password }),
    );
  }

  //? Función auxiliar para validar permisos de actualización
  private validateUserUpdatePermissions(
    userId: string,
    infoId: string,
    userRole: UserRole,
  ) {
    if (userId !== infoId) throw new ForbiddenException();
    if (userRole !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        "You don't have access to update this user",
      );
    }
  }
}

export const IS_PUBLIC_KEY = 'isPublic' + JWT_SECRET;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
