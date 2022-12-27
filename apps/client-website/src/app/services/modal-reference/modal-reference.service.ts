import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
