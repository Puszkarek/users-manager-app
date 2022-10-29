import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationToastComponent } from './notification-toast.component';

describe('NotificationToastComponent', () => {
  let component: NotificationToastComponent;
  let fixture: ComponentFixture<NotificationToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
