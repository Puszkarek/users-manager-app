import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalFormComponent } from './user-modal-form.component';

describe('UserModalFormComponent', () => {
  let component: UserModalFormComponent;
  let fixture: ComponentFixture<UserModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserModalFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
