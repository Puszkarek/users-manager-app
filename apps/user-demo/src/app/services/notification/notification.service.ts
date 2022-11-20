import { Injectable, Injector, ViewContainerRef } from '@angular/core';
import { NotificationToastComponent } from '@front/app/components/notification-toast';
import { NotificationData, NotificationType } from '@front/app/interfaces/notification';
import { firstValueFrom } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _viewContainerReference: ViewContainerRef | null = null;

  public setRootViewContainerRef(viewContainerReference: ViewContainerRef): void {
    this._viewContainerReference = viewContainerReference;
  }

  public async success(message: string): Promise<void> {
    await this._instantiateNotification(message, 'success');
  }

  public async error(message: string): Promise<void> {
    await this._instantiateNotification(message, 'error');
  }

  public async warn(message: string): Promise<void> {
    await this._instantiateNotification(message, 'warn');
  }

  public async info(message: string): Promise<void> {
    await this._instantiateNotification(message, 'info');
  }

  /** Create a new Component to show the notification, then destroy it  */
  private async _instantiateNotification(message: string, type: NotificationType): Promise<void> {
    if (!this._viewContainerReference) {
      console.log(message);
      return;
    }

    // Instantiate the necessary data for the notification
    const injector = Injector.create({
      providers: [
        {
          provide: NotificationData,
          useValue: new NotificationData(message, type),
        },
      ],
    });

    // Create the notification
    const reference = this._viewContainerReference.createComponent(NotificationToastComponent, {
      injector: injector,
    });

    // Wait a time then destroy the notification
    const NOTIFICATION_DURATION = 2000;
    await firstValueFrom(timer(NOTIFICATION_DURATION));
    reference.destroy();
  }
}
