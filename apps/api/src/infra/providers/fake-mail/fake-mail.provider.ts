import { IMailProvider, IMessage } from '@server/infra/interfaces';

export class FakeMailProvider implements IMailProvider {
  private readonly _transporter = {
    sendMail: async (message: IMessage): Promise<void> =>
      console.log(`sending email to ${message.to.email} from ${message.from.email}`),
  };

  public async sendMail(message: IMessage): Promise<void> {
    const { to, from, subject, body } = message;
    await this._transporter.sendMail({ body, from, subject, to });
  }
}
