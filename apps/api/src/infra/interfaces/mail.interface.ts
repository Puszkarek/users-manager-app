import { ExceptionError } from '@server/infra/interfaces/error.interface';
import { Either } from 'fp-ts/lib/Either';

export type IAddress = {
  readonly email: string;
  readonly name: string;
};

export type IMessage = {
  readonly to: IAddress;
  readonly from: IAddress;
  readonly subject: string;
  readonly body: string;
};

export type IMailProvider = {
  readonly sendMail: (message: IMessage) => Promise<Either<ExceptionError, void>>;
};
