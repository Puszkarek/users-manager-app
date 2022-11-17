import { Injectable, Injector, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { MODAL_DATA_TOKEN } from '@front/constants/modal';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModalService implements OnDestroy {
  /** It's initialize in the `AppComponent` initialization */
  private _viewContainerReference!: ViewContainerRef;

  private readonly _unsubscribe$ = new Subject<void>();

  public setRootViewContainerRef(viewContainerReference: ViewContainerRef): void {
    this._viewContainerReference = viewContainerReference;
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  /** Create a new Component to show the notification, then destroy it  */
  public openModal<ModalOutputData, ModalInputData>(
    component: Type<{
      readonly close$: Observable<ModalOutputData>;
    }>,
    data?: ModalInputData,
  ): {
    readonly data$: Observable<ModalOutputData>;
  } {
    // Instantiate the entry data for the Modal
    const injector = Injector.create({
      providers: [
        {
          provide: MODAL_DATA_TOKEN,
          useValue: data,
        },
      ],
    });

    // Create the Modal
    const reference = this._viewContainerReference.createComponent(component, {
      injector: injector,
    });

    // Destroy the component when the close action being called
    reference.instance.close$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => reference.destroy());

    return {
      data$: reference.instance.close$,
    };
  }
}
