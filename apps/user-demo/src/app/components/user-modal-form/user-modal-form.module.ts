import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@front/components/button';
import { FormFieldInputModule } from '@front/components/form-field-input';

import { UserModalFormComponent } from './user-modal-form.component';

@NgModule({
  declarations: [UserModalFormComponent],
  exports: [UserModalFormComponent],
  imports: [CommonModule, FormFieldInputModule, ButtonModule],
})
export class UserModalFormModule {}
