import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@front/app/components/button';
import { FormFieldInputModule } from '@front/app/components/form-field-input';
import { NotificationModule } from '@front/app/services/notification';

import { SelectInputModule } from '../select-input/select-input.module';
import { UserFormModalComponent } from './user-form-modal.component';

@NgModule({
  declarations: [UserFormModalComponent],
  exports: [UserFormModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificationModule,
    FormFieldInputModule,
    ButtonModule,
    SelectInputModule,
  ],
})
export class UserFormModalModule {}
