import { TestBed } from '@angular/core/testing';

import { NotificationModule } from './notification.module';
import { NotificationService } from './notification.service';

describe(NotificationService.name, () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotificationModule],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
