import { IUser } from '../../interfaces';

export interface registerReturn extends loginReturn {
  user: Omit<IUser, 'password'>;
}

export interface loginReturn {
  accessToken: string;
  refreshToken: string;
}

export interface jwtPayload {
  userId: string;
}