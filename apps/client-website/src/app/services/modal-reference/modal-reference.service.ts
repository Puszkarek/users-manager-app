import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * It's used to get a reference from the `Modal` in the current context
 *
 * @example Adding the `close` feature to a `Modal` component
 *
 * Suppose that we had the following `Component`:
 *
 * ```ts
 * class MyComponent {
 *   constructor(private readonly _modalService: ModalService) {}
 *
 *   public async openModal(): Promise<void> {
 *     // Open the modal and get the reference
 *     const close$ = this._modalService.open(MyModalComponent);
 *
 *     // Await to close
 *     await firstValueFrom(close$);
 *   }
 * }
 * ```
 *
 * Then the user trigger the `openModal` function, the `MyModalComponent` appears, and the user
 * already see everything that he needed.
 *
 * Now, how can we close that? Well, we need to inject this service inside the
 * `MyModalComponent`, then we can use a trigger to close the `Modal`
 *
 * The modal will look like that:
 *
 * ```
 * class MyModalComponent {
 *   constructor(private readonly _modalReference: ModalReference) {}
 *
 *   public close(): void {
 *     this._modalReference.close(null);
 *   }
 * }
 * ```
 *
 * The opened `Modal` will be destroyed after the use calls the `close` action, because an
 * unique instance of `ModalReference` was attached to the `modal` inside the `open` operations
 * of `ModalService`
 */
@Injectable({
  providedIn: 'platform',
})
export class ModalReference<T = unknown> {
  /** Emits when we wanna close the modal */
  private readonly _close$ = new Subject<T>();
  public readonly close$ = this._close$.asObservable();

  /**
   * Triggers an action to close the modal
   *
   * @param data - The output data to send to emit when closed
   */
  public close(data: T): void {
    this._close$.next(data);
    this._close$.complete();
  }
}
