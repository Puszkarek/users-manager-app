import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-maintenance-warn',
  styleUrls: ['./maintenance-warn.component.scss'],
  templateUrl: './maintenance-warn.component.html',
})
export class MaintenanceWarnComponent {}
