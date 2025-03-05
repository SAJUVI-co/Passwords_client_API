import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SetMetadata } from '@nestjs/common';
import { JWT_SECRET } from 'src/config/envs.config';
import { UpdateUserDto, UserOnline } from './dto/update-user.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
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

  async verifyPermissions(id: string) {
    const info = await lastValueFrom(
      this.cacheClient.send('getUserCache', {
        id: id,
      }),
    );
    return info;
  }

  async createCache(user: UpdateUserDto) {
    return await lastValueFrom(
      this.cacheClient.send<void>('saveCache', {
        id: user.id.toString(),
        data: user,
      }),
    );
  }
}

export const IS_PUBLIC_KEY = 'isPublic' + JWT_SECRET;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
