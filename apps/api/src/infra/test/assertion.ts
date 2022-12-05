/**
 * Throws an exception if the value is not what we expected
 *
 * (It's only used for testing purposes)
 *
 * @param value The value to assert
 * @param guardFN The guard method to use to check if the value is expected
 */
export const assertIs = <T>(value: unknown, guardFN: (value: unknown) => value is T): asserts value is T => {
  if (guardFN(value)) {
    return void 0;
  }
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(`Value is not expected: ${value}`);
};
