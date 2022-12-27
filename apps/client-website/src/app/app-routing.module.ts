/* eslint-disable @typescript-eslint/promise-function-async */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@front/app/guards/admin';
import { AuthGuard } from '@front/app/guards/auth';
import { LoggedGuard } from '@front/app/guards/logged';

const routes: Routes = [
  // Redirects
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  // Pages
  {
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./routes/dashboard-routing.module').then(({ DashboardRoutingModule }) => DashboardRoutingModule),
    path: 'dashboard',
  },
  {
    canActivate: [LoggedGuard],
    loadChildren: () => import('./routes/auth-routing.module').then(({ AuthRoutingModule }) => AuthRoutingModule),
    path: 'auth',
  },
  {
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./routes/admin-routing.module').then(({ AdminRoutingModule }) => AdminRoutingModule),
    path: 'admin',
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
