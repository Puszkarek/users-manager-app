import { Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { DropdownPanel } from '@front/app/interfaces/dropdown';
import { isFalse } from '@front/app/utils/functional';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appDropdownTrigger]',
})
export class DropdownTriggerDirective implements OnDestroy {
  private readonly _unsubscribe$ = new Subject<void>();

  /**
   * Emits when the dropdown state changes
   *
   * @defaultValue false
   */
  private _isDropdownOpen$ = new BehaviorSubject(false);

  /** The `Template` to render inside the dropdown */
  @Input('appDropdownTrigger') public dropdownPanel!: DropdownPanel;

  @HostListener('click') public toggleDropdown(): void {
    if (this._isDropdownOpen$.getValue()) {
      this._isDropdownOpen$.next(false);
    } else {
      // Update the dropdown state
      this._isDropdownOpen$.next(true);

      // Open dropdown
      this._openDropdown();
    }
  }

  constructor(
    private readonly _overlay: Overlay,
    private readonly _elementReference: ElementRef<HTMLElement>,
    private readonly _viewContainerReference: ViewContainerRef,
  ) {}

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  /**
   * Create an {@link Overlay} and attach the given panel to show to the user, then subscribe to
   * close event to close the dropdown when hit the `close` action
   */
  private _openDropdown(): void {
    // Create an overlay in the DOM
    const overlayReference = this._overlay.create({
      // * Backdrop
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',

      // * Strategies
      scrollStrategy: this._overlay.scrollStrategies.close(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._elementReference)
        .withPositions([
          {
            // Set axis origin
            originX: 'end',
            originY: 'bottom',
            // Set the overlay axis
            overlayX: 'center',
            overlayY: 'top',
            // It gives a distance between the `trigger` and the `dropdown, like a `padding`
            offsetY: 5,
          },
        ]),
    });

    // Create a Portal for the template
    const templatePortal = new TemplatePortal(this.dropdownPanel.templateRef, this._viewContainerReference);

    // Attach the template in the DOM
    overlayReference.attach(templatePortal);

    overlayReference
      .backdropClick()
      .pipe(
        // Completes when clicked on backdrop
        first(),
        // Completes when clicked on an item inside dropdown
        takeUntil(this.dropdownPanel.closed),
        // Completes when clicked on trigger
        takeUntil(this._isDropdownOpen$.pipe(filter(isFalse))),
        // Completes if the component be destroyed and none of the actions above was trigged
        takeUntil(this._unsubscribe$),
      )
      .subscribe({
        complete: () => {
          this._isDropdownOpen$.next(false);
          overlayReference.dispose();
          overlayReference.detach();
        },
      });
  }
}
