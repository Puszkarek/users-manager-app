import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { USER_NAME_MIN_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@front/constants';
import { isUser } from '@front/helpers';
import { FormStatus, User, USER_ROLE } from '@front/interfaces';
import { NotificationService } from '@front/services/notification';
import { CUSTOM_VALIDATORS } from '@front/utils';
import { isNil } from 'lodash';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-modal-form',
  styleUrls: ['./user-modal-form.component.scss'],
  templateUrl: './user-modal-form.component.html',
})
export class UserModalFormComponent implements OnInit {
  public readonly user: User | null = null;

  public readonly form = this._formBuilder.group(
    {
      email: ['', [Validators.required, CUSTOM_VALIDATORS.minLengthWithTrim(USER_NAME_MIN_LENGTH), Validators.email]],
      name: ['', [Validators.required, CUSTOM_VALIDATORS.minLengthWithTrim(USER_NAME_MIN_LENGTH)]],
      password: ['', [Validators.required, CUSTOM_VALIDATORS.minLengthWithTrim(USER_PASSWORD_MIN_LENGTH)]],
      passwordConfirmed: ['', Validators.required],
      role: [USER_ROLE.employee, Validators.required],
    },
    { validators: [CUSTOM_VALIDATORS.isPasswordEqual] },
  );

  private _formStatus: FormStatus = 'creating';

  public get formStatus(): FormStatus {
    return this._formStatus;
  }

  public get emailError(): string | null {
    const { errors, untouched } = this.form.controls.email;

    if (untouched) {
      return null;
    }
    if (isNil(errors)) {
      return null;
    }

    if (errors['required']) {
      return 'Email is required';
    }
    if (errors['email']) {
      return 'Email is invalid';
    }

    return null;
  }

  public get nameError(): string | null {
    const { errors, untouched } = this.form.controls.name;

    if (untouched) {
      return null;
    }
    if (isNil(errors)) {
      return null;
    }

    if (errors['required']) {
      return 'Name is required';
    }

    if (errors['minLength']) {
      return `The size of name must be at least ${USER_NAME_MIN_LENGTH} characters`;
    }

    return null;
  }

  private readonly _passwordErrors = {
    confirm: 'Please, confirm your password',
    isPasswordEqual: 'Password and Password Confirmation must be equal',
    minLength: `The size of password must be at least ${USER_PASSWORD_MIN_LENGTH} characters`,
    required: 'Password is required',
  };

  public get passwordError(): string | null {
    const { errors, untouched } = this.form.controls.password;
    if (untouched) {
      return null;
    }
    if (isNil(errors)) {
      return null;
    }

    if (errors['required']) {
      return this._passwordErrors.required;
    }

    if (errors['minLength']) {
      return this._passwordErrors.minLength;
    }

    return null;
  }

  public get passwordConfirmedError(): string | null {
    const { errors: controlErrors, untouched } = this.form.controls.passwordConfirmed;

    if (untouched) {
      return null;
    }

    const { errors: formErrors } = this.form;
    const errors = { ...controlErrors, ...formErrors };

    if (errors['required']) {
      return this._passwordErrors.required;
    }

    if (errors['isPasswordEqual']) {
      return this._passwordErrors.isPasswordEqual;
    }

    return null;
  }

  constructor(
    @Inject({}) data: UserModalFormComponentData,
    private readonly _formBuilder: NonNullableFormBuilder,
    private readonly _notificationService: NotificationService,
  ) {
    this.user = data.user;
  }

  public ngOnInit(): void {
    if (isUser(this.user)) {
      this._formStatus = 'editing';

      this.form.patchValue(this.user);
    }
  }

  public close(): void {
    // This._dialogReference.close();
  }

  public save(): void {
    if (this.form.valid) {
      // This._dialogReference.close(this.form.value);
    } else {
      this._notificationService.error('Form is invalid');
    }
  }
}

export type UserModalFormComponentData = {
  readonly user: User | null;
};
