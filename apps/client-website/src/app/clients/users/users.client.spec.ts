import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UsersClient } from './users.client';

describe(UsersClient.name, () => {
  let service: UsersClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UsersClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
