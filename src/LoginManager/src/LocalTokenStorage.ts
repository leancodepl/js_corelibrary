/// <reference path="../TokenStorage.d.ts" />

export class LocalTokenStorage implements TokenStorage {
    constructor(
        private tokenKey: string = "token",
        private refreshKey = "refresh_token",
        private expiryKey = "expiration_date") {
    }

    public get token(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    public set token(val: string | null) {
        this.setOrClearVar(this.tokenKey, val);
    }

    public get refreshToken(): string | null {
        return localStorage.getItem(this.refreshKey);
    }

    public set refreshToken(val: string | null) {
        this.setOrClearVar(this.refreshKey, val);
    }

    public get expirationDate(): Date | null {
        let exp = localStorage.getItem(this.expiryKey);
        return exp ? new Date(exp) : null;
    }

    public set expirationDate(val: Date | null) {
        let exp = val ? val.getTime().toString() : null;
        this.setOrClearVar(this.expiryKey, exp);
    }

    private setOrClearVar(key: string, val: string | null) {
        if (val) {
            localStorage.setItem(key, val);
        }
        else {
            localStorage.removeItem(key);
        }
    }
}
