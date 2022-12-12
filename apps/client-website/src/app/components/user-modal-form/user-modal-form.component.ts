import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { isUser, User, USER_ROLE } from '@api-interfaces';
import { USER_NAME_MIN_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@front/app/constants/form-settings';
import { MODAL_DATA_TOKEN } from '@front/app/constants/modal';
import { FormStatus } from '@front/app/interfaces/form';
import { NotificationService } from '@front/app/services/notification';
import { UsersStore } from '@front/app/stores/users';
import { CUSTOM_VALIDATORS } from '@front/app/utils';
import {
  getConfirmedPasswordError,
  getEmailInputErrorMessage,
  getNameInputErrorMessage,
  getPasswordError,
} from '@front/app/utils/auth-form-messages';
import { foldW } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { isNull } from 'lodash-es';
import { BehaviorSubject, filter, map, Subject } from 'rxjs';

// TODO: rename to `user-form-modal`
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-modal-form',
  styleUrls: ['./user-modal-form.component.scss'],
  templateUrl: './user-modal-form.component.html',
})
export class UserModalFormComponent implements OnInit {
  // TODO: Found a way to abstract this inside one factory
  /** Emits when we wanna close the modal */
  private readonly _close$ = new Subject<User | null>();
  public readonly close$ = this._close$.asObservable();

  /** The {@link User} that we wanna `edit`, If `null` means that we are `creating` a new user */
  public readonly user: User | null = null;

  public readonly form = this._fb.group(
    {
      email: ['', [Validators.required, CUSTOM_VALIDATORS.minLengthWithTrim(USER_NAME_MIN_LENGTH), Validators.email]],
      name: ['', [Validators.required, CUSTOM_VALIDATORS.minLengthWithTrim(USER_NAME_MIN_LENGTH)]],
      password: ['', [Validators.required, CUSTOM_VALIDATORS.minLengthWithTrim(USER_PASSWORD_MIN_LENGTH)]],
      passwordConfirmed: ['', Validators.required],
      role: [USER_ROLE.employee, Validators.required],
    },
    { validators: [CUSTOM_VALIDATORS.isPasswordEqual] },
  );

  /** The current status of the form */
  private readonly _formStatus$ = new BehaviorSubject<FormStatus>('creating');
  public readonly formStatus$ = this._formStatus$;

  /** Tht title of the form */
  public readonly formTitle$ = this._formStatus$.pipe(
    /** We don't wanna update the title when the status change to `saving` */
    filter(status => status !== 'saving'),
    map(status => {
      switch (status) {
        case 'creating': {
          return 'Creating User';
        }
        case 'editing': {
          return 'Editing User';
        }
        default: {
          return 'Loading...';
        }
      }
    }),
  );

  /** The name of the button that we use to save the changes */
  public readonly actionTitle$ = this._formStatus$.pipe(
    map(status => {
      switch (status) {
        case 'creating': {
          return 'Creating';
        }
        case 'editing': {
          return 'Editing';
        }
        case 'saving': {
          return 'Saving...';
        }
        default: {
          return 'Loading...';
        }
      }
    }),
  );

  /** Emits the input error if has one */
  public readonly emailError$ = getEmailInputErrorMessage(this.form.controls.email);

  /** Emits the input error if has one */
  public readonly nameError$ = getNameInputErrorMessage(this.form.controls.name);

  /** Emits the input error if has one */
  public readonly passwordError$ = getPasswordError(this.form.controls.password);

  /** Emits the input error if has one */
  public readonly confirmedPasswordError$ = getConfirmedPasswordError(this.form.controls.passwordConfirmed);

  /** The items to use in the user's `Rule` input */
  public readonly dropdownRuleItems = [
    {
      label: 'Administrator',
      value: USER_ROLE.admin,
    },
    {
      label: 'Manager',
      value: USER_ROLE.manager,
    },
    {
      label: 'Employee',
      value: USER_ROLE.employee,
    },
  ];

  constructor(
    @Inject(MODAL_DATA_TOKEN) data: UserModalFormComponentData,
    private readonly _fb: NonNullableFormBuilder,
    private readonly _notificationService: NotificationService,
    private readonly _usersStore: UsersStore,
  ) {
    this.user = data.user;
  }

  public ngOnInit(): void {
    if (isUser(this.user)) {
      this._formStatus$.next('editing');

      this.form.patchValue(this.user);
      this.form.markAsTouched();
      this.form.markAsDirty();
    }
  }

  /**
   * Triggers an action to close the modal
   *
   * @param user - The user just create / update, null if we had canceled the action
   */
  public close(user?: User | null): void {
    this._close$.next(user ?? null);
    this._close$.complete();
  }

  /**
   * Save the {@link User} in `backend`, if success close the modal, otherwise show one
   * notification to the user with the `Error`
   */
  public async save(): Promise<void> {
    if (this.form.valid) {
      /**
       * Since this modal will close after change we don't need to care about change to the
       * previous status after save
       */
      this._formStatus$.next('saving');

      /** Get the new values from form */
      const updatedValues = this.form.getRawValue();

      /** Make a request to the `backend` */
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

/** The data that we can inject in {@link UserModalFormComponent} while open the `modal` */
export type UserModalFormComponentData = {
  readonly user: User | null;
};
