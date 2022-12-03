import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, ViewContainerRef } from '@angular/core';
import { NotificationToastComponent } from '@front/app/components/notification-toast';
import { NotificationType } from '@front/app/interfaces/notification';
import { firstValueFrom } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';

import { NOTIFICATION_DATA_TOKEN } from '../../constants/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _viewContainerReference: ViewContainerRef | null = null;

  constructor(private readonly _overlay: Overlay) {}

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

  /** Create a new Component to show the notification, then destroy it */
  private async _instantiateNotification(message: string, type: NotificationType): Promise<void> {
    if (!this._viewContainerReference) {
      return;
    }

    // Instantiate the necessary data for the notification

    // * Initialize overlay
    const overlayConfig = this._getOverlayConfig();
    const overlayReference = this._overlay.create(overlayConfig);

    // * Create component portal
    const injector = Injector.create({
      providers: [
        {
          provide: NOTIFICATION_DATA_TOKEN,
          useValue: { message, type },
        },
      ],
    });
    const containerPortal = new ComponentPortal(NotificationToastComponent, this._viewContainerReference, injector);

    // * Attach to the view
    overlayReference.attach(containerPortal);

    // Wait a time then destroy the notification
    const NOTIFICATION_DURATION = 2000;
    await firstValueFrom(timer(NOTIFICATION_DURATION));
    overlayReference.detach();
    overlayReference.dispose();
  }

  /**
   * Init a `OverlayConfig` with default options
   *
   * @returns A standalone config for overlay
   */
  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      // * Setup
      hasBackdrop: false,
      disposeOnNavigation: true,

      // * Strategy
      scrollStrategy: this._overlay.scrollStrategies.noop(),
      positionStrategy: this._overlay.position().global().top().right(),
    });
  }
}
