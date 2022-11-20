import { ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';
import { ModalService } from '@front/services/modal';
import { NotificationService } from '@front/services/notification';
import { UsersStore } from '@front/stores/users';

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

    this._usersStore.load();
  }
}
