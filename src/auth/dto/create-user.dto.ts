import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  email: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo de recuperación debe ser válido' })
  email_recuperacion?: string;
}
