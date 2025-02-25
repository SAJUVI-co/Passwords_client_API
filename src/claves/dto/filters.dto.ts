import { IsInt, IsString } from 'class-validator';

export enum OrderEnum {
  asc = 'ASC',
  desc = 'DESC',
}

export class FindWithFilters {
  @IsInt({
    message: 'skip param must be interger number',
  })
  skip = 0;

  @IsInt({
    message: 'limit param must be interger number',
  })
  limit = 10;

  @IsString({
    message: 'limit param must be interger number',
  })
  order: OrderEnum;
}

export class FindOneWithFilters extends FindWithFilters {
  @IsInt({
    message: 'id param must be number',
  })
  id: number;
}
