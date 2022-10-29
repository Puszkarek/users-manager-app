import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent, LoginPageModule } from '../pages/login-page';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    component: LoginPageComponent,
    path: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES), LoginPageModule],
})
export class AuthRoutingModule {}
