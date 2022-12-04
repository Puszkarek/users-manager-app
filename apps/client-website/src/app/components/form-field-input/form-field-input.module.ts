import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormFieldInputComponent } from './form-field-input.component';

@NgModule({
  declarations: [FormFieldInputComponent],
  exports: [FormFieldInputComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class FormFieldInputModule {}
