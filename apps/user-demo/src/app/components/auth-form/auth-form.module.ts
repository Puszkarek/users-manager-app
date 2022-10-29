import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormFieldInputModule } from '@front/components/form-field-input';

import { AuthFormComponent } from './auth-form.component';

@NgModule({
  declarations: [AuthFormComponent],
  exports: [AuthFormComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormFieldInputModule,
  ],
})
export class AuthFormModule {}
