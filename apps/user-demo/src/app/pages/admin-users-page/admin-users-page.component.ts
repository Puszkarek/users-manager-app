import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-users-page',
  styleUrls: ['./admin-users-page.component.scss'],
  templateUrl: './admin-users-page.component.html',
})
export class AdminUsersPageComponent {}
