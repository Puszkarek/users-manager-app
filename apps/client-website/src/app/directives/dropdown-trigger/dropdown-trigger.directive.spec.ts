import { DropdownTriggerDirective } from './dropdown-trigger.directive';

describe(DropdownTriggerDirective.name, () => {
  let directive: DropdownTriggerDirective;
  beforeEach(() => {
    // TODO: this rule shouldn't be applied on `spec.ts` files, idk why the eslint is complain here
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    directive = new DropdownTriggerDirective(null!, null!, null!);
  });
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
