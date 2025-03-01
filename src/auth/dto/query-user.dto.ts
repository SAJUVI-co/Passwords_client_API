export class QueryFindAll {
  skip: string;
  limit: string;
}

export enum DateEnum {
  create = 'created_at',
  update = 'updated_at',
  delete = 'deleted_at',
}
