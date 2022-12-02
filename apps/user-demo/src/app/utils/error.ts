import { HttpErrorResponse } from '@angular/common/http';
import { UNKNOWN_ERROR_MESSAGE } from '@front/app/constants/messages';
import { isError, isString } from 'lodash-es';

export const toError = (value: unknown): Error => {
  console.log('value', value);
  if (value instanceof HttpErrorResponse) {
    const errorMessage: unknown = value.error?.message;
    return new Error(isString(errorMessage) ? errorMessage : UNKNOWN_ERROR_MESSAGE);
  }
  if (isError(value)) {
    return value;
  }

  return new Error(UNKNOWN_ERROR_MESSAGE);
};

export const toErrorMessage = (value: unknown): string => toError(value).message;
