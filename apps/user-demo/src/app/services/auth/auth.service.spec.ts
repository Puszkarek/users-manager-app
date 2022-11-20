import { TestBed } from '@angular/core/testing';
import { StoreTestingModule } from '@front/stores/root';

import { AuthService } from './auth.service';

describe(AuthService.name, () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestingModule],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
