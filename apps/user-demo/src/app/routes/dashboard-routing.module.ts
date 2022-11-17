import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent, DashboardPageModule } from '@front/pages/dashboard-page';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES), DashboardPageModule],
})
export class DashboardRoutingModule {}
