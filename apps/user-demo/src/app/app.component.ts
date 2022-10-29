import { ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';
import { NotificationService } from '@front/services/notification';
import { UsersStore } from '@front/stores';

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
    private readonly _usersStore: UsersStore,
  ) {
    this._notificationService.setRootViewContainerRef(viewContainerReference);

    this._notificationService.warn('It works');
  }
}
