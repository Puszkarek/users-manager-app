import { TestBed } from '@angular/core/testing';
import { StoreTestingModule } from '@front/app/stores/root';

import { AuthGuard } from './auth.guard';

describe(AuthGuard.name, () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestingModule],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
