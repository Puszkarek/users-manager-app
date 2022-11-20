import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@front/components/button';
import { IconModule } from '@front/components/icon';
import { UserModalFormModule } from '@front/components/user-modal-form';

import { UsersListComponent } from './users-list.component';

@NgModule({
  declarations: [UsersListComponent],
  exports: [UsersListComponent],
  imports: [CommonModule, IconModule, ButtonModule, UserModalFormModule],
})
export class UsersListModule {}
