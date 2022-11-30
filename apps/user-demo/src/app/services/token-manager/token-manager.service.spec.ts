import { TestBed } from '@angular/core/testing';
import { StoreTestingModule } from '@front/app/stores/root';

import { TokenManagerService } from './token-manager.service';

describe(TokenManagerService.name, () => {
  let service: TokenManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestingModule],
    });
    service = TestBed.inject(TokenManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
