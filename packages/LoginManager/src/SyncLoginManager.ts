/* eslint-disable import/prefer-default-export */
import { BaseLoginManager, LoginManager } from "./BaseLoginManager";
import { CannotRefreshToken } from "./CannotRefreshToken";
import { SyncTokenStorage } from "./TokenStorage";

export class SyncLoginManager extends BaseLoginManager<SyncTokenStorage> implements LoginManager {
    public signOut() {
        this.storage.resetToken();
        this.notify(false);
    }

    public isSigned() {
        return this.storage.getToken() !== null;
    }

    public async getToken() {
        const token = this.storage.getToken();
        if (token === null) {
            return null;
        } else if (token.expirationDate < new Date()) {
            if (await this.tryRefreshTokenInternal(token)) {
                return this.storage.getToken()?.token ?? null;
            } else {
                throw new CannotRefreshToken("Cannot refresh access token after it has expired");
            }
        } else {
            return token.token;
        }
    }
}
