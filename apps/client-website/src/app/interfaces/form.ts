/** All the available status that a `FormPage` can have */
export type FormStatus = 'creating' | 'editing' | 'loading' | 'saving';

export type FormLink = {
  readonly route: ReadonlyArray<string>;
  readonly text: string;
};

/**
 * The checkbox is has intentionally omitted because we have the mat-checkbox from material
 * library
 */
export type HTMLInputType = 'text' | 'number' | 'password' | 'email' | 'submit' | 'reset' | 'radio' | 'button' | 'file';
