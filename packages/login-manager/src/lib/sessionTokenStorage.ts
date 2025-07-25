import { SyncTokenStorage, Token } from "./tokenStorage"

/**
 * Stores OAuth2 tokens in browser sessionStorage.
 * 
 * Provides session-based token storage that clears when the browser tab is closed.
 * Implements SyncTokenStorage interface for synchronous operations.
 * 
 * @param tokenKey - sessionStorage key for access token (default: "token")
 * @param refreshKey - sessionStorage key for refresh token (default: "refresh_token")
 * @param expiryKey - sessionStorage key for expiry date (default: "expiration_date")
 * @example
 * ```typescript
 * const storage = new SessionTokenStorage();
 * const loginManager = new SyncLoginManager(storage, endpoint, secret, clientId, scopes);
 * ```
 */
export class SessionTokenStorage implements SyncTokenStorage {
    constructor(
        private tokenKey = "token",
        private refreshKey = "refresh_token",
        private expiryKey = "expiration_date",
    ) {}

    public getToken(): Token | null {
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

    public storeToken(token: Token): void {
        this.setValue(this.tokenKey, token.token)
        this.setValue(this.refreshKey, token.refreshToken)
        this.setValue(this.expiryKey, token.expirationDate.getTime().toString())
    }

    public resetToken(): void {
        this.remove(this.tokenKey)
        this.remove(this.refreshKey)
        this.remove(this.expiryKey)
    }

    private hasValue(key: string): boolean {
        return sessionStorage.getItem(key) !== null
    }

    private getValue(key: string): string {
        return sessionStorage.getItem(key) as string
    }

    private setValue(key: string, val: string) {
        sessionStorage.setItem(key, val)
    }

    private remove(key: string) {
        sessionStorage.removeItem(key)
    }
}
