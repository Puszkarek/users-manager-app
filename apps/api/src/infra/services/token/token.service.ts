import { AuthToken, ID, User } from '@api-interfaces';
import { createExceptionError, extractError } from '@server/infra/helpers/error';
import { ExceptionError, REQUEST_STATUS } from '@server/infra/interfaces/error.interface';
import { taskEither } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import * as jose from 'jose';

export class TokenService {
  /** The key that we use to encrypt the token, so that it just can be read at our backend */
  private readonly _tokenSecret = new TextEncoder().encode('ADD-SECRET-KEY-LATER'); // TODO: move to `.env`

  /**
   * Check if the given {@link ID} is valid, then generate a token linked with the respective
   * {@link User}
   *
   * @param userID - The id
   * @returns The token that was generated
   */
  public readonly generateToken = (userID: User['id']): TaskEither<ExceptionError, AuthToken> => {
    return pipe(
      // * Create the new token
      userID,
      this._createToken,
    );
  };

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
  public readonly parseToken = (JWT: AuthToken): TaskEither<ExceptionError, jose.JWTVerifyResult> => {
    return taskEither.tryCatch(
      async () => {
        const parsedJWT = await jose.jwtVerify(JWT, this._tokenSecret, {
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
  private readonly _createToken = (userID: string): TaskEither<ExceptionError, AuthToken> => {
    return taskEither.tryCatch(
      async () =>
        await new jose.SignJWT({ userID })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setIssuer('urn:example:issuer') // TODO: i don't know what really is it
          .setAudience('urn:example:audience')
          .setExpirationTime('1d')
          .sign(this._tokenSecret),
      error => createExceptionError(extractError(error).message, REQUEST_STATUS.bad),
    );
  };
}
