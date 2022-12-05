import { IMessage } from '@server/infra/interfaces';
import { isLeft, isRight } from 'fp-ts/lib/Either';

import { FakeMailProvider } from './fake-mail.provider';

/**
 * If other mail provider start to be implemented we can abstract and just change update the
 * `beforeEach` since they will follow the same interface
 */
describe(FakeMailProvider.name, () => {
  let provider: FakeMailProvider;
  beforeEach(() => {
    provider = new FakeMailProvider();
  });

  it('should create', () => {
    expect(provider).toBeTruthy();
  });

  it('Should return a `Right` on success', async () => {
    // TODO: `generateMessage`
    const message: IMessage = {
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

    const either = await provider.sendMail(message);

    expect(isRight(either)).toEqual(true);
  });

  it('Should return a `Left` when given wrong params', async () => {
    const nonValidMessage = null;

    const either = await provider.sendMail(nonValidMessage as any);

    expect(isLeft(either)).toEqual(true);
  });
});
