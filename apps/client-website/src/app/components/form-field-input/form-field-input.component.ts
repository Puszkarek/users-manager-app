import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HTMLInputType } from '@front/app/interfaces/form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-form-field-input',
  styleUrls: ['./form-field-input.component.scss'],
  templateUrl: './form-field-input.component.html',
})
export class FormFieldInputComponent {
  @Input() public label: string | null = null;

  @Input() public placeholder = '';

  @Input() public type: HTMLInputType = 'text';

  private _formControl: FormControl | undefined = undefined;

  @Input() public set control(control: FormControl | undefined) {
    // TODO: transform into a controlValue Accessor
    this._formControl = control;
  }

  public get control(): FormControl | undefined {
    return this._formControl;
  }

  public get formControl(): FormControl | undefined {
    return this._formControl;
  }
}
