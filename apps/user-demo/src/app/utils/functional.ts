/** Utils to handle functional pattern in a easy way */

/**
 * A little abstraction to use on pipes
 *
 * .eg: obs$.pipe(map(...), filter(isTrue))
 */
export const isTrue = (value: boolean): boolean => value;
