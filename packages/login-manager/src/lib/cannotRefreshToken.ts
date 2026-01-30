/**
 * Error thrown when token refresh fails.
 *
 * Indicates that the refresh token is invalid or expired, requiring user to sign in again.
 *
 * @example
 * ```typescript
 * try {
 *   const token = await loginManager.getToken();
 * } catch (error) {
 *   if (error instanceof CannotRefreshToken) {
 *     console.log('User needs to sign in again');
 *   }
 * }
 * ```
 */
export class CannotRefreshTokenError extends Error {
  constructor(m: string) {
    super(m)
    this.name = "CannotRefreshTokenError"
    Object.setPrototypeOf(this, CannotRefreshTokenError.prototype)
  }
}
