import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldInputComponent } from './form-field-input.component';
import { FormFieldInputModule } from './form-field-input.module';

describe(FormFieldInputComponent.name, () => {
  let component: FormFieldInputComponent;
  let fixture: ComponentFixture<FormFieldInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldInputModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
