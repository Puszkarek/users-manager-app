import { ListPipe } from './list.pipe';

describe(ListPipe.name, () => {
  let pipe: ListPipe;

  beforeEach(() => {
    pipe = new ListPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should humanize an Array', () => {
    const parsedList = pipe.transform(['first', 'one']);
    expect(parsedList).toBe('First, One');
  });
});
