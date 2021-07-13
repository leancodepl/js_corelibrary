/* eslint-disable import/prefer-default-export */
import { SyncTokenStorage, Token } from "./TokenStorage";

export class MemoryTokenStorage implements SyncTokenStorage {
    private token: Token | null = null;

    public getToken(): Token | null {
        return this.token;
    }

    public storeToken(token: Token): Promise<void> {
        this.token = {
            token: token.token,
            refreshToken: token.refreshToken,
            expirationDate: token.expirationDate,
        };
        return Promise.resolve();
    }

    public resetToken(): Promise<void> {
        this.token = null;
        return Promise.resolve();
    }
}
