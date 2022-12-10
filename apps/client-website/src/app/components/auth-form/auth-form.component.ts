import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthFormEntries } from '@front/app/interfaces/auth';
import { FormLink } from '@front/app/interfaces/form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-form',
  styleUrls: ['./auth-form.component.scss'],
  templateUrl: './auth-form.component.html',
})
export class AuthFormComponent {
  /** The name of the form to show to the user */
  @Input() public title = 'Auth';

  /** The submit button text to show to the user */
  @Input() public confirmButtonText = 'Confirm';

  @Input() public link: FormLink | null = null;

  /** Emits the form value to the parent component when submitted */
  @Output() public readonly submitted = new EventEmitter<AuthFormEntries>();

  /** The form with to get the info that we need to login the user */
  public readonly form = this._fb.group({
    email: this._fb.control('', [Validators.email], []),
    password: this._fb.control('', [Validators.required], []),
  });

  constructor(private readonly _fb: NonNullableFormBuilder) {}

  /** Check if form is valid, then it emits the value */
  public submit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.getRawValue());
    }
  }

  /** Validation for the password input */
  public get isPasswordRequired(): boolean {
    const control = this.form.controls.password;
    return control.dirty && control.hasError('required') && control.touched;
  }

  /** Validation for the email input */
  public get isEmailValid(): boolean {
    const control = this.form.controls.email;
    return control.dirty && control.hasError('email') && control.touched;
  }
}
