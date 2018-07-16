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
        return await this.storage.getToken() !== null;
    }

    public async getToken() {
        let token = await this.storage.getToken();
        if (token === null) {
            return null;
        }
        if (token.expirationDate < new Date()) {
            if (!await this.tryRefreshTokenInternal(token)) {
                throw new CannotRefreshToken("Cannot refresh access token after it has expired");
            }
        }
        return token.token;
    }

    public async load() {
        let isSignedIn = await this.isSigned();
        this.notify(isSignedIn);
    }
}
