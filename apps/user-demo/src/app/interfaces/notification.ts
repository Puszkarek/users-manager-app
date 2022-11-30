export type NotificationType = 'info' | 'error' | 'warn' | 'success';

export class NotificationData {
  constructor(public readonly message: string, public readonly type: NotificationType) {}
}
