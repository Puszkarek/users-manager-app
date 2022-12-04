import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@front/app/components/button';
import { FormFieldInputModule } from '@front/app/components/form-field-input';

import { UserModalFormComponent } from './user-modal-form.component';

@NgModule({
  declarations: [UserModalFormComponent],
  exports: [UserModalFormComponent],
  imports: [CommonModule, ReactiveFormsModule, FormFieldInputModule, ButtonModule],
})
export class UserModalFormModule {}
