import { ExceptionError } from '@server/infra/interfaces/error.interface';
import { TaskEither } from 'fp-ts/lib/TaskEither';

/** Address to send some message */
export type Address = {
  /** Contact's email */
  readonly email: string;
  /** Contact's name */
  readonly name: string;
};

/** A message to send by email */
export type Message = {
  /** Who's receiving */
  readonly to: Address;
  /** Who's sending */
  readonly from: Address;
  /** The title */
  readonly subject: string;
  /** The message itself */
  readonly body: string;
};

/** An abstract interface that all our email providers should follow */
export type MailProvider = {
  readonly sendMail: (message: Message) => TaskEither<ExceptionError, void>;
};
