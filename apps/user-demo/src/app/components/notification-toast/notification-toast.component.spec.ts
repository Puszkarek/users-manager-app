import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationData } from '@front/interfaces/notification.interface';

import { NotificationToastComponent } from './notification-toast.component';
import { NotificationToastModule } from './notification-toast.module';

describe('NotificationToastComponent', () => {
  let component: NotificationToastComponent;
  let fixture: ComponentFixture<NotificationToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationToastModule],
      providers: [
        {
          provide: NotificationData,
          useValue: new NotificationData('testing', 'info'),
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
