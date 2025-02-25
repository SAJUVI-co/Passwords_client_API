import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserClaveDto {
  @IsNotEmpty({ message: 'El user_id es requerido' })
  @IsInt({ message: 'El user_id debe ser de tipo entero' })
  user_id: number;
}
