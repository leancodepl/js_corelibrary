/// <reference path="../TokenStorage.d.ts" />

export class SessionTokenStorage implements TokenStorage {
    constructor(
        private tokenKey: string = "token",
        private refreshKey = "refresh_token",
        private expiryKey = "expiration_date") {
    }

    public get token(): string | null {
        return sessionStorage.getItem(this.tokenKey);
    }

    public set token(val: string | null) {
        this.setOrClearVar(this.tokenKey, val);
    }

    public get refreshToken(): string | null {
        return sessionStorage.getItem(this.refreshKey);
    }

    public set refreshToken(val: string | null) {
        this.setOrClearVar(this.refreshKey, val);
    }

    public get expirationDate(): Date | null {
        let exp = sessionStorage.getItem(this.expiryKey);
        return exp ? new Date(Number(exp)) : null;
    }

    public set expirationDate(val: Date | null) {
        let exp = val ? val.getTime().toString() : null;
        this.setOrClearVar(this.expiryKey, exp);
    }

    private setOrClearVar(key: string, val: string | null) {
        if (val) {
            sessionStorage.setItem(key, val);
        }
        else {
            sessionStorage.removeItem(key);
        }
    }
}