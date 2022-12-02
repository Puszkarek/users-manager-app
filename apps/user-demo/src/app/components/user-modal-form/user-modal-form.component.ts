import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { isUser, User, USER_ROLE } from '@api-interfaces';
import { USER_NAME_MIN_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@front/app/constants/form-settings';
import { MODAL_DATA_TOKEN } from '@front/app/constants/modal';
import { FormStatus } from '@front/app/interfaces/form';
import { NotificationService } from '@front/app/services/notification';
import { UsersStore } from '@front/app/stores/users';
import { CUSTOM_VALIDATORS } from '@front/app/utils';
import { foldW } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { isNil, isNull } from 'lodash-es';
import { Subject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-modal-form',
  styleUrls: ['./user-modal-form.component.scss'],
  templateUrl: './user-modal-form.component.html',
})
export class UserModalFormComponent implements OnInit {
  // TODO: Found a way to abstract this inside one factory
  private readonly _close$ = new Subject<User | null>();
  public readonly close$ = this._close$.asObservable();

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
      return 'required';
    }
    if (errors['email']) {
      return 'invalid';
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
      return 'required';
    }

    if (errors['minLength']) {
      return `must have at least ${USER_NAME_MIN_LENGTH} characters`;
    }

    return null;
  }

  private readonly _passwordErrors = {
    confirm: 'please, confirm your password',
    isPasswordEqual: 'passwords must be equal',
    minLength: `must have at least ${USER_PASSWORD_MIN_LENGTH} characters`,
    required: 'required',
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
    @Inject(MODAL_DATA_TOKEN) data: UserModalFormComponentData,
    private readonly _formBuilder: NonNullableFormBuilder,
    private readonly _notificationService: NotificationService,
    private readonly _usersStore: UsersStore,
  ) {
    this.user = data.user;
  }

  public ngOnInit(): void {
    if (isUser(this.user)) {
      this._formStatus = 'editing';

      this.form.patchValue(this.user);
    }
  }

  public close(data?: User | null): void {
    this._close$.next(data ?? null);
    this._close$.complete();
  }

  public async save(): Promise<void> {
    if (this.form.valid) {
      const updatedValues = this.form.getRawValue();

      const either = await (isNull(this.user)
        ? this._usersStore.create(updatedValues)
        : this._usersStore.update({
            ...this.user,
            ...updatedValues,
          }));

      pipe(
        either,
        foldW(
          async error => this._notificationService.error(error.message),
          user => this.close(user),
        ),
      );
    } else {
      this._notificationService.error('Please, check the inputs and try again');
    }
  }
}

export type UserModalFormComponentData = {
  readonly user: User | null;
};
