import { User } from './user.interface';

export type AuthFormEntries = {
  readonly email: string;
  readonly password: string;
};

export type LoginStatus =
  | {
      readonly status: 'undefined' | 'logout';
    }
  | {
      readonly status: 'logged';
      readonly user: User;
    };
