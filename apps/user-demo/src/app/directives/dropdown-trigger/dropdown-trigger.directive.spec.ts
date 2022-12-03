import { DropdownTriggerDirective } from './dropdown-trigger.directive';

describe('DropdownTriggerDirective', () => {
  let directive!: DropdownTriggerDirective;
  beforeEach(() => {
    directive = new DropdownTriggerDirective(null!, null!, null!);
  });
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
