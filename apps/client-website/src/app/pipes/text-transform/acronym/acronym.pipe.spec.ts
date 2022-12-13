import { AcronymPipe } from './acronym.pipe';

describe(AcronymPipe.name, () => {
  let pipe: AcronymPipe;

  beforeEach(() => {
    pipe = new AcronymPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should parse the acronym from given name', () => {
    expect(pipe.transform('Name')).toBe('N');
    expect(pipe.transform('Big Name')).toBe('BN');
    expect(pipe.transform('lower case name')).toBe('LCN');
  });
});
