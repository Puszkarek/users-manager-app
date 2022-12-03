import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { NotificationData } from '@front/app/interfaces/notification';

import { NOTIFICATION_DATA_TOKEN } from '../../constants/notification';

@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.component.html',
  styleUrls: ['./notification-toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationToastComponent {
  public readonly message = this._notificationData.message;
  public readonly type = this._notificationData.type;

  constructor(@Inject(NOTIFICATION_DATA_TOKEN) private readonly _notificationData: NotificationData) {}
}
