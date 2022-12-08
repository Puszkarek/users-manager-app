import { ExceptionError } from '@server/infra/interfaces/error.interface';
import { Either } from 'fp-ts/lib/Either';

/** Address to send some message */
export type IAddress = {
  /** Contact's email */
  readonly email: string;
  /** Contact's name */
  readonly name: string;
};

/** A message to send by email */
export type IMessage = {
  /** Who's receiving */
  readonly to: IAddress;
  /** Who's sending */
  readonly from: IAddress;
  /** The title */
  readonly subject: string;
  /** The message itself */
  readonly body: string;
};

/** An abstract interface that all our email providers should follow */
export type IMailProvider = {
  readonly sendMail: (message: IMessage) => Promise<Either<ExceptionError, void>>;
};
