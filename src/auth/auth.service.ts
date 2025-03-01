import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SetMetadata } from '@nestjs/common';
import { JWT_SECRET } from 'src/config/envs.config';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

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
}

export const IS_PUBLIC_KEY = 'isPublic' + JWT_SECRET;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
