import { Role } from '../enums/role.enum';

export interface IPermission {
  id?: number;
  name?: 'CREATE' | 'SELECT' | 'UPDATE' | 'DELETE' | 'BLOCK' | string;
}

export interface IRole {
  id?: number;
  name?: string;
  permissions?: IPermission[];
}
export interface IRoleUser {
  id?: number;
  name?: string;
}
export interface IUser {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  matricule?: string;
  statut?: 'ACTIVE' | string;
  lieu?: string;
  activated?: 'ACTIVE' | 'BLOCKED' | string;
  email?: string;
  idEmploye?: number;
  dateCreateUser?: string; // or Date if parsed
  dateUpdateUser?: string; // or Date if parsed
  block?: boolean;
  roles?: IRole[];
  role?: IRoleUser;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modules: any[];
}
