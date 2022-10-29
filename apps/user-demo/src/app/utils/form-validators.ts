import { AbstractControl, ValidationErrors } from '@angular/forms';
import { trim } from 'lodash';

const makePositiveNumberValidator: () => (control: AbstractControl) => ValidationErrors | null = () => {
  const minAllowed = 0;
  return control => (control.value <= minAllowed ? { nonZero: true } : null);
};

const makeMinLengthWithTrim: (minLength: number) => (control: AbstractControl<string>) => ValidationErrors | null =
  minLength => control =>
    trim(control.value).length < minLength ? { minLength: true } : null;

const makeIsPasswordEqualValidator: (
  control: AbstractControl<{ readonly password: string; readonly passwordConfirmed: string }>,
) => ValidationErrors | null = control => {
  const { password, passwordConfirmed } = control.value;

  return password === passwordConfirmed ? null : { isPasswordEqual: true };
};

export const CUSTOM_VALIDATORS = {
  isPasswordEqual: makeIsPasswordEqualValidator,
  minLengthWithTrim: makeMinLengthWithTrim,
  positiveNumber: makePositiveNumberValidator,
};
