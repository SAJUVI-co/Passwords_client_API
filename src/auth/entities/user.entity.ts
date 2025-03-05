export enum UserRole {
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
  rol: UserRole;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
