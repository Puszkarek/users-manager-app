import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthFormModule } from '@front/app/components/auth-form';
import { NotificationModule } from '@front/app/services/notification';

import { LoginPageComponent } from './login-page.component';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [CommonModule, RouterModule, NotificationModule, AuthFormModule],
})
export class LoginPageModule {}
