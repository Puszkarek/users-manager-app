import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-page',
  styleUrls: ['./dashboard-page.component.scss'],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {}
