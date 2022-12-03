import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@front/app/components/button';
import { FormFieldInputModule } from '@front/app/components/form-field-input';
import { MODAL_DATA_TOKEN } from '@front/app/constants/modal';
import { StoreTestingModule } from '@front/app/stores/root/store-testing.module';

import { UserModalFormComponent } from './user-modal-form.component';

describe(UserModalFormComponent.name, () => {
  let component: UserModalFormComponent;
  let fixture: ComponentFixture<UserModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserModalFormComponent],
      imports: [StoreTestingModule, CommonModule, ReactiveFormsModule, FormFieldInputModule, ButtonModule],
      providers: [
        {
          provide: MODAL_DATA_TOKEN,
          useValue: {
            user: null,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
