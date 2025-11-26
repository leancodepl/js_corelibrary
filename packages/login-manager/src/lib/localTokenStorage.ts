import { SyncTokenStorage, Token } from "./tokenStorage"

/**
 * Stores OAuth2 tokens in browser localStorage.
 *
 * Provides persistent token storage that survives browser sessions.
 * Implements SyncTokenStorage interface for synchronous operations.
 *
 * @param tokenKey - localStorage key for access token (default: "token")
 * @param refreshKey - localStorage key for refresh token (default: "refresh_token")
 * @param expiryKey - localStorage key for expiry date (default: "expiration_date")
 * @example
 * ```typescript
 * const storage = new LocalTokenStorage();
 * const loginManager = new SyncLoginManager(storage, endpoint, secret, clientId, scopes);
 * ```
 */
export class LocalTokenStorage implements SyncTokenStorage {
  constructor(
    private tokenKey = "token",
    private refreshKey = "refresh_token",
    private expiryKey = "expiration_date",
  ) {}

  public getToken(): null | Token {
    if (this.hasValue(this.tokenKey)) {
      return {
        token: this.getValue(this.tokenKey),
        refreshToken: this.getValue(this.refreshKey),
        expirationDate: new Date(Number(this.getValue(this.expiryKey))),
      }
    } else {
      return null
    }
  }

  public storeToken(token: Token) {
    this.setValue(this.tokenKey, token.token)
    this.setValue(this.refreshKey, token.refreshToken)
    this.setValue(this.expiryKey, token.expirationDate.getTime().toString())
  }

  public resetToken() {
    this.remove(this.tokenKey)
    this.remove(this.refreshKey)
    this.remove(this.expiryKey)
  }

  private hasValue(key: string): boolean {
    return localStorage.getItem(key) !== null
  }

  private getValue(key: string): string {
    return localStorage.getItem(key) as string
  }

  private setValue(key: string, val: string) {
    localStorage.setItem(key, val)
  }

  private remove(key: string) {
    localStorage.removeItem(key)
  }
}
