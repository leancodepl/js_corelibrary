import "cross-fetch/polyfill";
import { BaseLoginManager, LoginManager } from "./BaseLoginManager";
import { CannotRefreshToken } from "./CannotRefreshToken";
import { SyncTokenStorage } from "./TokenStorage";

export class SyncLoginManager extends BaseLoginManager<SyncTokenStorage> implements LoginManager {
    public signOut(): void {
        this.storage.resetToken();
        this.notify(false);
    }

    public isSigned() {
        return this.storage.getToken() !== null;
    }

    public async getToken() {
        let token = this.storage.getToken();
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
}
