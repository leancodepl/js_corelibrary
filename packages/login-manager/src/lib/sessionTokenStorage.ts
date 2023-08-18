import { SyncTokenStorage, Token } from "./tokenStorage";

export class SessionTokenStorage implements SyncTokenStorage {
    constructor(
        private tokenKey: string = "token",
        private refreshKey: string = "refresh_token",
        private expiryKey: string = "expiration_date",
    ) {}

    public getToken(): Token | null {
        if (this.hasValue(this.tokenKey)) {
            return {
                token: this.getValue(this.tokenKey),
                refreshToken: this.getValue(this.refreshKey),
                expirationDate: new Date(Number(this.getValue(this.expiryKey))),
            };
        } else {
            return null;
        }
    }

    public storeToken(token: Token): void {
        this.setValue(this.tokenKey, token.token);
        this.setValue(this.refreshKey, token.refreshToken);
        this.setValue(this.expiryKey, token.expirationDate.getTime().toString());
    }

    public resetToken(): void {
        this.remove(this.tokenKey);
        this.remove(this.refreshKey);
        this.remove(this.expiryKey);
    }

    private hasValue(key: string): boolean {
        return sessionStorage.getItem(key) !== null;
    }

    private getValue(key: string): string {
        return sessionStorage.getItem(key) as string;
    }

    private setValue(key: string, val: string) {
        sessionStorage.setItem(key, val);
    }

    private remove(key: string) {
        sessionStorage.removeItem(key);
    }
}
