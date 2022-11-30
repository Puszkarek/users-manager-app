import { TestBed } from '@angular/core/testing';
import { StoreTestingModule } from '@front/app/stores/root';

import { AdminGuard } from './admin.guard';

describe(AdminGuard.name, () => {
  let guard: AdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestingModule],
    });
    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
