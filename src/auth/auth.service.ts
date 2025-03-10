import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SetMetadata } from '@nestjs/common';
import { JWT_SECRET } from 'src/config/envs.config';
import { UserDto } from './dto/update-user.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USERS_SERVICE') private readonly userServiceClient: ClientProxy, // Cliente del microservicio
    @Inject('USERS_CACHE') private readonly cacheClient: ClientProxy, // Cliente del microservicio
  ) {}

  // Genera un token para cada usuario
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

  // verifica el rol usando el body
  async verifyRol(body: UserDto) {
    if (!body || body === null || body === undefined)
      throw new UnauthorizedException(
        'Sorry, you dont have acces to this route',
      );

    const newId: string = body?.id ? body.id.toString() : '1';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const findUserCache: Promise<any> = await this.verifyPermissions(newId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!(await findUserCache) || (await findUserCache).rol === UserRole.INVITE)
      throw new UnauthorizedException(
        'Sorry, you dont have acces to this route',
      );

    // console.log(await findUserCache);

    return true;
  }

  // verifica el rol usando el id
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

  // almacena en cache
  async createCache(user: UserDto) {
    return await lastValueFrom(
      this.cacheClient.send<void>('saveCache', {
        id: user.id.toString(),
        data: user,
      }),
    );
  }

  // Crea un usuario
  createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userServiceClient.send('createUser', createUserDto);
      return newUser;
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  // Busca todos los usuarios
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

  // Busca un usuario
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
}

export const IS_PUBLIC_KEY = 'isPublic' + JWT_SECRET;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
