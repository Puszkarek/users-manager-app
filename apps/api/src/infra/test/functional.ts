import { Either, isRight } from 'fp-ts/lib/Either';
import { isSome, Option } from 'fp-ts/lib/Option';
/**
 * Throws an exception if the value is not an `Some<T>`
 *
 * (It's only used for testing purposes)
 */
export const fromSome = <T>(value: Option<T>): T => {
  if (isSome(value)) {
    return value.value;
  }
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(`Value is None`);
};

/**
 * Throws an exception if the value is not what we expected
 *
 * (It's only used for testing purposes)
 *
 * @param value - The value to assert
 * @param guardFN - The guard method to use to check if the value is expected
 */
export const fromRight = <A, B>(value: Either<A, B>): B => {
  if (isRight(value)) {
    return value.right;
  }
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(`Value is None`);
};
