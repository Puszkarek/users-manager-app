import { User } from '@api-interfaces';

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
