import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceWarnComponent } from './maintenance-warn.component';

describe('MaintenanceWarnComponent', () => {
  let component: MaintenanceWarnComponent;
  let fixture: ComponentFixture<MaintenanceWarnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceWarnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceWarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
