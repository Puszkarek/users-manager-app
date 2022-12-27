import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { MODAL_DATA_TOKEN } from '@front/app/constants/modal';
import { ModalReference } from '@front/app/services/modal-reference';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'any',
})
export class ModalService implements OnDestroy {
  /** It's initialize in the `AppComponent` initialization */
  private _viewContainerReference!: ViewContainerRef;

  private readonly _unsubscribe$ = new Subject<void>();

  constructor(private readonly _overlay: Overlay) {}

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

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
   * Will instantiate a component modal and attach to the view
   *
   * @param component - The component to use as a modal
   * @param data - The optional data to inject inside modal
   * @returns A subscription that will emit after the the close action be triggered
   */
  public openModal<ModalOutputData, ModalInputData>(
    component: Type<unknown>,
    data?: ModalInputData,
  ): {
    readonly data$: Observable<ModalOutputData>;
  } {
    // * Initialize overlay
    const overlayConfig = this._getOverlayConfig();
    const overlayReference = this._overlay.create(overlayConfig);

    // * Inject the required data
    const modalReference = new ModalReference<ModalOutputData>();
    const injector = Injector.create({
      providers: [
        {
          provide: MODAL_DATA_TOKEN,
          useValue: data,
        },
        {
          provide: ModalReference,
          useValue: modalReference,
        },
      ],
    });

    // * Create component portal

    const containerPortal = new ComponentPortal(component, this._viewContainerReference, injector);

    // * Attach to the view
    const reference = overlayReference.attach(containerPortal);

    // * Listen to backdrop clicks to close
    overlayReference
      .backdropClick()
      .pipe(
        first(),
        // Completes when the close action be triggered
        takeUntil(modalReference.close$),
        takeUntil(this._unsubscribe$),
      )
      .subscribe({
        complete: () => {
          reference.destroy();
          overlayReference.detach();
          overlayReference.dispose();
        },
      });

    // * Returns the data
    return {
      data$: modalReference.close$,
    };
  }

  /**
   * Init a `OverlayConfig` with default options
   *
   * @returns A standalone config for overlay
   */
  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      // * Setup
      hasBackdrop: true,
      disposeOnNavigation: false,

      // * Custom CSS classes
      backdropClass: 'modal-backdrop',
      panelClass: 'modal-panel',

      // * Strategy
      scrollStrategy: this._overlay.scrollStrategies.noop(),
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
    });
  }
}
