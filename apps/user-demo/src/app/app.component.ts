import { ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';
import { ModalService } from '@front/app/services/modal';
import { NotificationService } from '@front/app/services/notification';
import { UsersStore } from '@front/app/stores/users';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public readonly isAdmin$ = this._usersStore.isLoggedUserAdmin$;

  constructor(
    viewContainerReference: ViewContainerRef,
    private readonly _notificationService: NotificationService,
    private readonly _modalService: ModalService,
    private readonly _usersStore: UsersStore,
  ) {
    // Inject the ViewContainer into the notification Service
    this._notificationService.setRootViewContainerRef(viewContainerReference);
    this._modalService.setRootViewContainerRef(viewContainerReference);
  }
}
