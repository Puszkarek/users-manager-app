import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUsersPageComponent } from '@front/app/pages/admin-users-page/admin-users-page.component';
import { AdminUsersPageModule } from '@front/app/pages/admin-users-page/admin-users-page.module';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users',
  },
  {
    component: AdminUsersPageComponent,
    path: 'users',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES), AdminUsersPageModule],
})
export class AdminRoutingModule {}
