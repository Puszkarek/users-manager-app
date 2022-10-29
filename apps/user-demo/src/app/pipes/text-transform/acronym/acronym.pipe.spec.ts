import { AcronymPipe } from './acronym.pipe';

describe(AcronymPipe.name, () => {
  it('create an instance', () => {
    const pipe = new AcronymPipe();

    expect(pipe).toBeTruthy();
  });
});
