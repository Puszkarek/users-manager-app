import { IMailProvider, IMessage, REQUEST_STATUS } from '@server/infra/interfaces';
import { Either } from 'fp-ts/lib/Either';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { isError } from 'lodash';

import { createExceptionError } from '../../helpers/error.helper';
import { ExceptionError } from '../../interfaces/error.interface';

export class FakeMailProvider implements IMailProvider {
  private readonly _transporter = {
    sendMail: async (message: IMessage): Promise<void> =>
      console.log(`sending email to ${message.to.email} from ${message.from.email}`),
  };

  public async sendMail(message: IMessage): Promise<Either<ExceptionError, void>> {
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
