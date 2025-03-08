import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SetMetadata } from '@nestjs/common';
import { JWT_SECRET } from 'src/config/envs.config';
import { UserDto } from './dto/update-user.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

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

  async createCache(user: UserDto) {
    return await lastValueFrom(
      this.cacheClient.send<void>('saveCache', {
        id: user.id.toString(),
        data: user,
      }),
    );
  }

  createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userServiceClient.send('createUser', createUserDto);
      return newUser;
    } catch (error) {
      return new NotFoundException(error);
    }
  }
}

export const IS_PUBLIC_KEY = 'isPublic' + JWT_SECRET;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
