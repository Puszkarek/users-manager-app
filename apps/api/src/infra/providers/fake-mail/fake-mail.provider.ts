import { createExceptionError, extractError } from '@server/infra/helpers/error';
import { MailProvider, Message, REQUEST_STATUS } from '@server/infra/interfaces';
import { ExceptionError } from '@server/infra/interfaces/error.interface';
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither';

export const generateFakeMailProvider = (): MailProvider => {
  /** Fake transporter for demonstration */
  const transporter = {
    // eslint-disable-next-line @typescript-eslint/require-await
    sendMail: async (message: Message): Promise<void> =>
      console.log(`sending email to ${message.to.email} from ${message.from.email}`),
  };

  return {
    /**
     * Send an email using an transporter
     *
     * @param message - The message to send
     * @returns On success it'll be void, otherwise the error that happened
     */
    sendMail: (message: Message): TaskEither<ExceptionError, void> => {
      return tryCatch(
        async () => {
          const { to, from, subject, body } = message;
          await transporter.sendMail({ body, from, subject, to });

          return void 0;
        },
        (error: unknown) => {
          return createExceptionError(extractError(error).message, REQUEST_STATUS.bad);
        },
      );
    },
  };
};
