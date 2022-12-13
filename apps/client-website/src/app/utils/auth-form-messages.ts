import { FormControl } from '@angular/forms';
import { USER_NAME_MIN_LENGTH, USER_PASSWORD_MIN_LENGTH } from '@front/app/constants/form-settings';
import { isNil } from 'lodash-es';

/**
 * Check the errors inside the {@link FormControl} and get the error message if has one
 *
 * @param control - The form control to get the errors message
 * @returns The error message, or `null` if doesn't exist
 */
export const getEmailInputErrorMessage = (control: FormControl<string>): string | null => {
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
};

/**
 * Check the errors inside the {@link FormControl} and get the error message if has one
 *
 * @param control - The form control to get the errors message
 * @returns The error message, or `null` if doesn't exist
 */
export const getNameInputErrorMessage = ({ errors, untouched }: FormControl<string>): string | null => {
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
 * Check the errors inside the {@link FormControl} and get the error message if has one
 *
 * @param control - The form control to get the errors message
 * @returns The error message, or `null` if doesn't exist
 */
export const getPasswordError = ({ errors, untouched }: FormControl<string>): string | null => {
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
};

/**
 * Check the errors inside the {@link FormControl} and get the error message if has one
 *
 * @param passwordControl - The form control to get the errors message
 * @returns The error message, or `null` if doesn't exist
 */
export const getConfirmedPasswordError = (passwordControl: FormControl<string>): string | null => {
  const {
    errors: controlErrors,
    untouched,
    root: { errors: formErrors },
  } = passwordControl;

  if (untouched) {
    return null;
  }

  const errors = { ...controlErrors, ...formErrors };

  if (errors['required']) {
    return PASSWORD_ERROR_MESSAGES.required;
  }

  if (errors['isPasswordEqual']) {
    return PASSWORD_ERROR_MESSAGES.isPasswordEqual;
  }

  return null;
};
