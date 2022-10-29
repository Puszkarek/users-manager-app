import { TestBed } from '@angular/core/testing';

import { UsersClient } from './users.client';

describe('Users.ClientService', () => {
  let service: UsersClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
