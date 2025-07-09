import { BaseLoginManager, LoginManager } from "./baseLoginManager";
import { CannotRefreshToken } from "./cannotRefreshToken";
import { AsyncTokenStorage } from "./tokenStorage";

/**
 * Manages OAuth2 authentication with asynchronous token storage.
 * 
 * Extends BaseLoginManager to work with async storage implementations like IndexedDB or remote storage.
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
 * const tokenStorage = new CustomAsyncStorage();
 * const loginManager = new AsyncLoginManager(
 *   tokenStorage,
 *   'https://api.example.com',
 *   'client_secret',
 *   'client_id',
 *   'openid profile'
 * );
 * ```
 */
export class AsyncLoginManager extends BaseLoginManager<AsyncTokenStorage> implements LoginManager {
    public async signOut(): Promise<void> {
        await this.storage.resetToken();
        this.notify(false);
    }

    public async isSigned() {
        return (await this.storage.getToken()) !== null;
    }

    public async getToken() {
        const token = await this.storage.getToken();
        if (token === null) {
            return null;
        } else if (token.expirationDate < new Date()) {
            if (await this.tryRefreshTokenInternal(token)) {
                return (await this.storage.getToken())?.token ?? null;
            } else {
                throw new CannotRefreshToken("Cannot refresh access token after it has expired");
            }
        } else {
            return token.token;
        }
    }

    public async load() {
        const isSignedIn = await this.isSigned();
        this.notify(isSignedIn);
    }
}
