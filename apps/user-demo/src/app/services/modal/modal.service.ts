import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { MODAL_DATA_TOKEN } from '@front/app/constants/modal';
import { combineLatest, Observable, Subject } from 'rxjs';
import { first, skip, startWith, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModalService implements OnDestroy {
  /** It's initialize in the `AppComponent` initialization */
  private _viewContainerReference!: ViewContainerRef;

  private readonly _unsubscribe$ = new Subject<void>();

  constructor(public readonly overlay: Overlay) {}

  public setRootViewContainerRef(viewContainerReference: ViewContainerRef): void {
    this._viewContainerReference = viewContainerReference;
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();

    console.log(this._viewContainerReference);
  }

  public openModal<ModalOutputData, ModalInputData>(
    component: Type<{
      readonly close$: Observable<ModalOutputData>;
    }>,
    data?: ModalInputData,
  ): {
    readonly data$: Observable<ModalOutputData>;
  } {
    // * Initialize overlay
    const overlayConfig = this._getOverlayConfig();
    const overlayReference = this.overlay.create(overlayConfig);

    // * Create component portal
    const injector = this._createInjector(data);
    const containerPortal = new ComponentPortal(component, this._viewContainerReference, injector);

    // * Attach to the view
    const reference = overlayReference.attach(containerPortal);

    // * Listen to backdrop clicks to close
    combineLatest(
      // ? Really that rxjs doesn't have any method to do these things ????
      [overlayReference.backdropClick(), reference.instance.close$].map(obs$ =>
        (obs$ as Observable<unknown>).pipe(startWith(null)),
      ),
    )
      .pipe(skip(1), first(), takeUntil(this._unsubscribe$))
      .subscribe(() => {
        console.log('here');
        overlayReference.detach();
        overlayReference.dispose();
      });

    // * Returns the data
    return {
      data$: reference.instance.close$,
    };
  }

  private _createInjector<T>(data: T): Injector {
    return Injector.create({
      providers: [
        {
          provide: MODAL_DATA_TOKEN,
          useValue: data,
        },
      ],
    });
  }

  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      // * Setup
      hasBackdrop: true,
      disposeOnNavigation: false,

      // * Custom CSS classes
      backdropClass: 'modal-backdrop',
      panelClass: 'modal-panel',

      // * Strategy
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    });
  }
}
