export type NotificationType = 'info' | 'error' | 'warn' | 'success';

export type NotificationData = {
  readonly message: string;
  readonly type: NotificationType;
};
