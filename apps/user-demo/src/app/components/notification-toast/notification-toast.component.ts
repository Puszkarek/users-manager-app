import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationData } from '@front/interfaces/notification.interface';

@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.component.html',
  styleUrls: ['./notification-toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationToastComponent {
  public readonly message = this._notificationData.message;
  public readonly type = this._notificationData.type;

  constructor(private readonly _notificationData: NotificationData) {}
}
