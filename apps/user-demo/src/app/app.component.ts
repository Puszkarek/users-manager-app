import { ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';
import { AuthService } from '@front/app/services/auth';
import { ModalService } from '@front/app/services/modal';
import { NotificationService } from '@front/app/services/notification';

import { UsersStore } from './stores/users/users.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public isAuthenticated$ = this._usersStore.isAuthenticated$;
  constructor(
    viewContainerReference: ViewContainerRef,
    private readonly _notificationService: NotificationService,
    private readonly _modalService: ModalService,
    private readonly _usersStore: UsersStore,
    private readonly _authService: AuthService,
  ) {
    // Inject the ViewContainer into the notification Service
    this._notificationService.setRootViewContainerRef(viewContainerReference);
    this._modalService.setRootViewContainerRef(viewContainerReference);
  }

  public logout(): void {
    this._authService.logout();
  }
}
