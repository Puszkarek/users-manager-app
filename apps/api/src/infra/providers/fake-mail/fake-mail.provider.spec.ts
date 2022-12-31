import { Message } from '@server/infra/interfaces';
import { MailProvider } from '@server/infra/interfaces/mail.interface';
import { isLeft, isRight } from 'fp-ts/lib/Either';

import { generateFakeMailProvider } from './fake-mail.provider';

/**
 * If other mail provider start to be implemented we can abstract and just change update the
 * `beforeEach` since they will follow the same interface
 */
describe(generateFakeMailProvider.name, () => {
  let provider: MailProvider;
  beforeEach(() => {
    provider = generateFakeMailProvider();
  });

  it('should create', () => {
    expect(provider).toBeTruthy();
  });

  it('should return a `Right` on success', async () => {
    expect.hasAssertions();

    // TODO: `generateMessage`
    const message: Message = {
      body: '',
      from: {
        email: '',
        name: '',
      },
      subject: '',
      to: {
        email: '',
        name: '',
      },
    };

    const either = await provider.sendMail(message)();

    expect(isRight(either)).toBe(true);
  });

  it('should return a `Left` when given wrong params', async () => {
    expect.hasAssertions();

    const nonValidMessage = null;

    const either = await provider.sendMail(nonValidMessage as any)();

    expect(isLeft(either)).toBe(true);
  });
});
