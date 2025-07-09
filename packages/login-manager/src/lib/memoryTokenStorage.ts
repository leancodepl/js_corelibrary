import { SyncTokenStorage, Token } from "./tokenStorage"

/**
 * Stores OAuth2 tokens in memory.
 * 
 * Provides temporary token storage that clears when the page is refreshed.
 * Implements SyncTokenStorage interface for synchronous operations.
 * 
 * @example
 * ```typescript
 * const storage = new MemoryTokenStorage();
 * const loginManager = new SyncLoginManager(storage, endpoint, secret, clientId, scopes);
 * ```
 */
export class MemoryTokenStorage implements SyncTokenStorage {
    private token: Token | null = null

    public getToken(): Token | null {
        return this.token
    }

    public storeToken(token: Token): Promise<void> {
        this.token = {
            token: token.token,
            refreshToken: token.refreshToken,
            expirationDate: token.expirationDate,
        }
        return Promise.resolve()
    }

    public resetToken(): Promise<void> {
        this.token = null
        return Promise.resolve()
    }
}
