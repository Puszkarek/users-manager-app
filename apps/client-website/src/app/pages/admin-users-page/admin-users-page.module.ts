import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersListModule } from '@front/app/components/users-list';

import { AdminUsersPageComponent } from './admin-users-page.component';

@NgModule({
  declarations: [AdminUsersPageComponent],
  imports: [CommonModule, UsersListModule],
})
export class AdminUsersPageModule {}
