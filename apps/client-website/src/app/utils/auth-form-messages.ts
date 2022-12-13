import { FormControl } from '@angular/forms';
import { USER_NAME_MIN_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@front/app/constants/form-settings';
import { isEqual, isNil } from 'lodash-es';
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';

/**
 * Listen to value changes in the {@link FormControl} then update the error message if has one
 *
 * @param control - The form control to get the errors message
 * @returns The error message, or `null` if doesn't exist
 */
export const getEmailInputErrorMessage = (control: FormControl<string>): Observable<string | null> => {
  return control.valueChanges.pipe(
    distinctUntilChanged(isEqual),
    map(() => {
      const { errors } = control;

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
    }),
  );
};

/**
 * Listen to value changes in the {@link FormControl} then update the error message if has one
 *
 * @param control - The form control to get the errors message
 * @returns The error message, or `null` if doesn't exist
 */
export const getNameInputErrorMessage = (control: FormControl<string>): Observable<string | null> => {
  return control.valueChanges.pipe(
    distinctUntilChanged(isEqual),
    map(() => {
      const { errors } = control;

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
    }),
  );
};

// * Password inputs

/** The messages to show to the user */
const PASSWORD_ERROR_MESSAGES = {
  confirm: 'please, confirm your password',
  isPasswordEqual: 'passwords must be equal',
  minLength: `must have at least ${USER_PASSWORD_MIN_LENGTH} characters`,
  required: 'required',
};

/**
 * Listen to value changes in the {@link FormControl} then update the error message if has one
 *
 * @param control - The form control to get the errors message
 * @returns The error message, or `null` if doesn't exist
 */
export const getPasswordError = (control: FormControl<string>): Observable<string | null> => {
  return control.valueChanges.pipe(
    distinctUntilChanged(isEqual),
    map(() => {
      const { errors } = control;

      if (isNil(errors)) {
        return null;
      }

      if (errors['required']) {
        return PASSWORD_ERROR_MESSAGES.required;
      }

      if (errors['minLength']) {
        return PASSWORD_ERROR_MESSAGES.minLength;
      }

      return null;
    }),
  );
};

/**
 * Listen to value changes in the {@link FormControl} then update the error message if has one
 *
 * @param passwordControl - The form control to get the errors message
 * @returns The error message, or `null` if doesn't exist
 */
export const getConfirmedPasswordError = (
  passwordControl: FormControl<string>,
  confirmPasswordControl: FormControl<string>,
): Observable<string | null> => {
  return combineLatest([passwordControl.valueChanges, confirmPasswordControl.valueChanges]).pipe(
    distinctUntilChanged(isEqual),
    map(() => {
      const { errors: controlErrors } = passwordControl;

      const {
        root: { errors: formErrors },
      } = passwordControl;

      const errors = { ...controlErrors, ...formErrors };

      if (errors['required']) {
        return PASSWORD_ERROR_MESSAGES.required;
      }

      if (errors['isPasswordEqual']) {
        console.log('here');
        return PASSWORD_ERROR_MESSAGES.isPasswordEqual;
      }

      return null;
    }),
  );
};
