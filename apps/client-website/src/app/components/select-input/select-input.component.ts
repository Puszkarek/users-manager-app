import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { map, ReplaySubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

type DropdownItem = {
  readonly label: string;
  readonly value: string;
};

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true,
    },
  ],
})
export class SelectInputComponent implements OnInit, ControlValueAccessor {
  @Input() public inputLabel = 'Pick one';

  @Input() public items: ReadonlyArray<DropdownItem> = [];

  /** The current value selected by the input */
  private readonly _selectedValue$ = new ReplaySubject<string>();
  public readonly selectedValue$ = this._selectedValue$.asObservable();

  /** The label of the current value selected by the input */
  public readonly selectedLabel$ = this.selectedValue$.pipe(
    map(value => {
      return this.items.find(item => item.value === value)?.label;
    }),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );

  public ngOnInit(): void {
    this.selectedValue$.subscribe(selectedValue => {
      this._onChange(selectedValue);
      this._onTouched();
    });
  }

  // * Control Value Accessor
  public writeValue(value: string): void {
    this._selectedValue$.next(value);
  }

  private _onChange = (_value: string): void => void 0;
  public registerOnChange(onChange: (value: string) => void): void {
    this._onChange = onChange;
  }

  private _onTouched = (): void => void 0;
  public registerOnTouched(onTouched: () => void): void {
    this._onTouched = onTouched;
  }

  // * Select input

  /**
   * Updates the selected value with a new value
   *
   * @param newValue - The value to select
   */
  public updateSelectedValue(newValue: string): void {
    this._selectedValue$.next(newValue);
  }

  // * Performance
  public trackByValue(_index: number, item: DropdownItem): string {
    return item.value;
  }
}
