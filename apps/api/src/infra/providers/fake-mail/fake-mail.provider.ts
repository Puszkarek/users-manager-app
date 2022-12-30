import { createExceptionError } from '@server/infra/helpers/error';
import { MailProvider, Message, REQUEST_STATUS } from '@server/infra/interfaces';
import { ExceptionError } from '@server/infra/interfaces/error.interface';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { isError } from 'lodash';

export class FakeMailProvider implements MailProvider {
  /** Fake transporter for demonstration */
  private readonly _transporter = {
    // eslint-disable-next-line @typescript-eslint/require-await
    sendMail: async (message: Message): Promise<void> =>
      console.log(`sending email to ${message.to.email} from ${message.from.email}`),
  };

  /**
   * Send an email using an transporter
   *
   * @param message - The message to send
   * @returns On success it'll be void, otherwise the error that happened
   */
  public sendMail(message: Message): TaskEither<ExceptionError, void> {
    return tryCatch(
      async () => {
        const { to, from, subject, body } = message;
        await this._transporter.sendMail({ body, from, subject, to });

        return void 0;
      },
      (error: unknown) => {
        if (isError(error)) {
          return createExceptionError(error.message, REQUEST_STATUS.bad);
        }
        return createExceptionError('Unknown Error', REQUEST_STATUS.bad);
      },
    );
  }
}
