import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, ViewContainerRef } from '@angular/core';
import { NotificationToastComponent } from '@front/app/components/notification-toast';
import { NOTIFICATION_DATA_TOKEN } from '@front/app/constants/notification';
import { NotificationType } from '@front/app/interfaces/notification';
import { firstValueFrom } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';

@Injectable({
  providedIn: 'any',
})
export class NotificationService {
  private _viewContainerReference: ViewContainerRef | null = null;

  constructor(private readonly _overlay: Overlay) {}

  /**
   * We need that because we can't inject `setRootViewContainerRef` directly inside a service,
   * so we are injecting inside the `app.component` and calling this function to pass the
   * service here
   *
   * @param viewContainerReference - The `ViewContainerRef` to use for instantiate modals
   */
  public setRootViewContainerRef(viewContainerReference: ViewContainerRef): void {
    this._viewContainerReference = viewContainerReference;
  }

  /**
   * Show a notification to the user when an action works perfectly
   *
   * @param message - The message to show in the notification
   */
  public async success(message: string): Promise<void> {
    await this._instantiateNotification(message, 'success');
  }

  /**
   * Show a notification to the user when an action fails
   *
   * @param message - The message to show in the notification
   */
  public async error(message: string): Promise<void> {
    await this._instantiateNotification(message, 'error');
  }

  /**
   * Show a notification to the user to warn about something
   *
   * @param message - The message to show in the notification
   */
  public async warn(message: string): Promise<void> {
    await this._instantiateNotification(message, 'warn');
  }

  /**
   * Show a notification to the user that needs to be aware of something that happens
   *
   * @param message - The message to show in the notification
   */
  public async info(message: string): Promise<void> {
    await this._instantiateNotification(message, 'info');
  }

  /**
   * Create a new Component to show the notification, then wait for a specific duration and
   * destroy it
   */
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

    // Wait a time that the user can read it
    const NOTIFICATION_DURATION = 2000;
    await firstValueFrom(timer(NOTIFICATION_DURATION));

    // Then destroy the notification component
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
