import { AuthToken } from '@api-interfaces';
import { createExceptionError, extractError } from '@server/infra/helpers/error';
import { ExceptionError, REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import * as jose from 'jose';
import { isEmpty, isString } from 'lodash';

/** The key that we use to encrypt the token, so that it just can be read at our backend */
const TOKEN_SECRET = new TextEncoder().encode('ADD-SECRET-KEY-LATER'); // TODO: move to `.env`

/**
 * Parses the given {@link AuthToken} and returns the results
 *
 * P.S: it'll catch an error when:
 *
 * 1. The format be wrong
 * 2. When the token secret doesn't match
 * 3. Or when it expire
 *
 * @param JWT - The token to parse
 * @returns On success the parsed token, otherwise the error that happened
 */
export const parseToken = (JWT: AuthToken): TaskEither<ExceptionError, jose.JWTVerifyResult> => {
  return TE.tryCatch(
    async () => {
      const parsedJWT = await jose.jwtVerify(JWT, TOKEN_SECRET, {
        issuer: 'urn:example:issuer',
        audience: 'urn:example:audience',
      });
      return parsedJWT;
    },
    error => {
      return createExceptionError(extractError(error).message, REQUEST_STATUS.bad);
    },
  );
};

/**
 * Generates and encrypt a token for the related user
 *
 * @param userID - The user {@link ID} to attach in the token
 * @returns The generated token
 */
export const generateToken = (userID: string): TaskEither<ExceptionError, AuthToken> => {
  return TE.tryCatch(
    async () =>
      await new jose.SignJWT({ userID })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('urn:example:issuer') // TODO: i don't know what really is it
        .setAudience('urn:example:audience')
        .setExpirationTime('1d')
        .sign(TOKEN_SECRET),
    error => createExceptionError(extractError(error).message, REQUEST_STATUS.bad),
  );
};

/**
 * Get the token key from `Bearer`
 *
 * @param bearer - The `Bearer` token (e.g: `Bearer my-token-encrypted`)
 * @returns The encrypted key from `Bearer` value
 */
export const parseRawToken = (bearer: string | undefined): E.Either<ExceptionError, AuthToken> => {
  return pipe(
    // * Check if it's a string
    bearer,
    E.fromPredicate(isString, () => createExceptionError("Value ins't valid", REQUEST_STATUS.bad)),
    // * Get the piece with the encrypted token
    E.map(token => token.split(' ')[1]),
    // * Filter possible falsy values
    E.filterOrElse(
      (value): value is string => isString(value) && !isEmpty(value), // Needs to be a string and not be empty
      () => createExceptionError('Missing authentication token', REQUEST_STATUS.unauthorized),
    ),
  );
};
