import "cross-fetch/polyfill";
import { BaseLoginManager, LoginManager } from "./BaseLoginManager";
import { CannotRefreshToken } from "./CannotRefreshToken";
import { AsyncTokenStorage } from "./TokenStorage";

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
                return await this.storage.getToken();
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
