import { FormControl } from '@angular/forms';
import { USER_NAME_MIN_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@front/app/constants/form-settings';
import { isEqual, isNil } from 'lodash-es';
import { distinctUntilChanged, map, Observable } from 'rxjs';

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
      const { errors, untouched } = control;
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
      const { errors, untouched } = control;
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
      const { errors, untouched } = control;
      if (untouched) {
        return null;
      }
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
 * @param control - The form control to get the errors message
 * @returns The error message, or `null` if doesn't exist
 */
export const getConfirmedPasswordError = (control: FormControl<string>): Observable<string | null> => {
  return control.valueChanges.pipe(
    distinctUntilChanged(isEqual),
    map(() => {
      const { errors: controlErrors, untouched } = control;
      if (untouched) {
        return null;
      }

      const {
        root: { errors: formErrors },
      } = control;

      const errors = { ...controlErrors, ...formErrors };

      if (errors['required']) {
        return PASSWORD_ERROR_MESSAGES.required;
      }

      if (errors['isPasswordEqual']) {
        return PASSWORD_ERROR_MESSAGES.isPasswordEqual;
      }

      return null;
    }),
  );
};
