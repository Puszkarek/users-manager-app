/* eslint-disable @typescript-eslint/require-await */
import { createExceptionError } from '@server/infra/helpers/error.helper';
import { MailProvider, Message, REQUEST_STATUS } from '@server/infra/interfaces';
import { ExceptionError } from '@server/infra/interfaces/error.interface';
import { Either } from 'fp-ts/lib/Either';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { isError } from 'lodash';

export class FakeMailProvider implements MailProvider {
  /** Fake transporter for demonstration */
  private readonly _transporter = {
    sendMail: async (message: Message): Promise<void> =>
      console.log(`sending email to ${message.to.email} from ${message.from.email}`),
  };

  /**
   * Send an email using an transporter
   *
   * @param message - The message to send
   * @returns On success it'll be void, otherwise the error that happened
   */
  public async sendMail(message: Message): Promise<Either<ExceptionError, void>> {
    /** Just a example of tryCatch use */
    const taskEither = tryCatch(
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

    return taskEither();
  }
}
