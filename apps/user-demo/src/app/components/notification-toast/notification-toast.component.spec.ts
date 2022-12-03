import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NOTIFICATION_DATA_TOKEN } from '../../constants/notification';
import { NotificationToastComponent } from './notification-toast.component';
import { NotificationToastModule } from './notification-toast.module';

describe(NotificationToastComponent.name, () => {
  let component: NotificationToastComponent;
  let fixture: ComponentFixture<NotificationToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationToastModule],
      providers: [
        {
          provide: NOTIFICATION_DATA_TOKEN,
          useValue: {
            message: 'testing',
            type: 'info',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
