import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-form-field-input',
  styleUrls: ['./form-field-input.component.scss'],
  templateUrl: './form-field-input.component.html',
})
export class FormFieldInputComponent {}
