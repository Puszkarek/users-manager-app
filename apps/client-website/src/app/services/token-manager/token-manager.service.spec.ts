import { TestBed } from '@angular/core/testing';
import { StoreTestingModule } from '@front/app/stores/root/store-testing.module';

import { TokenManagerService } from './token-manager.service';

const MOCKED_TOKEN = 'my-moked-token';
describe(TokenManagerService.name, () => {
  let service: TokenManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreTestingModule],
    });
    service = TestBed.inject(TokenManagerService);

    // Clear the current token
    service.setToken(null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update the token in cache with the new value', () => {
    service.setToken(MOCKED_TOKEN);

    const savedToken = service.getToken();

    expect(savedToken).toBe(MOCKED_TOKEN);
  });

  it('should RETURN null if none token as saved', () => {
    const savedToken = service.getToken();

    expect(savedToken).toBeNull();
  });

  it('should RETURN null if the saved token BE a empty string', () => {
    service.setToken('');

    const savedToken = service.getToken();

    expect(savedToken).toBeNull();
  });
});
