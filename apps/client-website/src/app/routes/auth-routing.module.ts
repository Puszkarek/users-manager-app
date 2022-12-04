import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent, LoginPageModule } from '@front/app/pages/login-page';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES), LoginPageModule],
})
export class AuthRoutingModule {}
