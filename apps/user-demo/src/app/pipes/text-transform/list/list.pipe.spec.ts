import { ListPipe } from './list.pipe';

describe(ListPipe.name, () => {
  it('create an instance', () => {
    const pipe = new ListPipe();

    expect(pipe).toBeTruthy();
  });
});
