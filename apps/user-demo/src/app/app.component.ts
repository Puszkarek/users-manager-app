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
    // Inject the ViewContainer into the notification Service
    this._notificationService.setRootViewContainerRef(viewContainerReference);

    this._usersStore.load();

    this._usersStore.getAll().subscribe(result => {
      console.log(result.toArray());
    });
  }
}
