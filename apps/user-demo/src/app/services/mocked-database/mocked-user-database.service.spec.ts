import { TestBed } from '@angular/core/testing';

import { MockedUserDatabaseService } from './mocked-user-database.service';

describe('MockedDatabaseService', () => {
  let service: MockedUserDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockedUserDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
