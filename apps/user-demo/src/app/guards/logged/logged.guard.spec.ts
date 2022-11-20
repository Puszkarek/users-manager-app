import { TestBed } from '@angular/core/testing';
import { StoreTestingModule } from '@front/app/stores/root';

import { LoggedGuard } from './logged.guard';

describe(LoggedGuard.name, () => {
  let guard: LoggedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestingModule],
    });
    guard = TestBed.inject(LoggedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
