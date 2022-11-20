import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthFormEntries } from '@front/interfaces/auth';
import { FormLink } from '@front/interfaces/form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-form',
  styleUrls: ['./auth-form.component.scss'],
  templateUrl: './auth-form.component.html',
})
export class AuthFormComponent {
  @Input() public title = 'Auth';

  @Input() public confirmButtonText = 'Confirm';

  @Input() public link: FormLink | null = null;

  @Output() public readonly submitted = new EventEmitter<AuthFormEntries>();

  public readonly form = this._fb.group({
    email: this._fb.control('', [Validators.email], []),
    password: this._fb.control('', [Validators.required], []),
  });

  constructor(private readonly _fb: NonNullableFormBuilder) {}

  public submit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.getRawValue());
    }
  }

  public get isPasswordRequired(): boolean {
    const control = this.form.controls.password;
    return control.dirty && control.hasError('required') && control.touched;
  }

  public get isEmailValid(): boolean {
    const control = this.form.controls.email;
    return control.dirty && control.hasError('email') && control.touched;
  }
}
