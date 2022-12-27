import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@front/app/components/button';
import { IconModule } from '@front/app/components/icon';
import { UserFormModalModule } from '@front/app/components/user-form-modal';
import { ModalModule } from '@front/app/services/modal';
import { NotificationModule } from '@front/app/services/notification';

import { UsersListComponent } from './users-list.component';

@NgModule({
  declarations: [UsersListComponent],
  exports: [UsersListComponent],
  imports: [CommonModule, IconModule, ModalModule, NotificationModule, ButtonModule, UserFormModalModule],
})
export class UsersListModule {}
