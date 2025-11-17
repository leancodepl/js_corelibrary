import { BaseLoginManager, LoginManager } from "./baseLoginManager"
import { CannotRefreshToken } from "./cannotRefreshToken"
import { SyncTokenStorage } from "./tokenStorage"

/**
 * Manages OAuth2 authentication with synchronous token storage.
 *
 * Extends BaseLoginManager to work with sync storage implementations like localStorage or sessionStorage.
 * Handles token refresh, expiration, and authentication state management.
 *
 * @param storage - Token storage implementation
 * @param endpoint - OAuth2 server endpoint
 * @param clientSecret - Client secret for authentication
 * @param clientId - OAuth2 client identifier
 * @param scopes - Space-separated OAuth2 scopes
 * @param additionalParams - Additional OAuth2 parameters
 * @example
 * ```typescript
 * const tokenStorage = new LocalTokenStorage();
 * const loginManager = new SyncLoginManager(
 *   tokenStorage,
 *   'https://api.example.com',
 *   'client_secret',
 *   'client_id',
 *   'openid profile'
 * );
 * ```
 */
export class SyncLoginManager extends BaseLoginManager<SyncTokenStorage> implements LoginManager {
  public signOut() {
    this.storage.resetToken()
    this.notify(false)
  }

  public isSigned() {
    return this.storage.getToken() !== null
  }

  public async getToken() {
    const token = this.storage.getToken()
    if (token === null) {
      return null
    } else if (token.expirationDate < new Date()) {
      if (await this.tryRefreshTokenInternal(token)) {
        return this.storage.getToken()?.token ?? null
      } else {
        throw new CannotRefreshToken("Cannot refresh access token after it has expired")
      }
    } else {
      return token.token
    }
  }
}
