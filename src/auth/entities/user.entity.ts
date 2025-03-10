export enum UserRoleEntity {
  SUPERADMIN = 'sudo',
  ADMIN = 'admin',
  INVITE = 'invite',
}

export enum UserOnline {
  ONLINE = 'true',
  OFFLINE = 'false',
}

export class User {
  id: number;
  username: string;
  email: string;
  email_recuperacion: string;
  password: string;
  rol: UserRoleEntity;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
