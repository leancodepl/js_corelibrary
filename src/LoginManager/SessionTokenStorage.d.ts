/// <reference path="TokenStorage.d.ts" />
export declare class SessionTokenStorage implements TokenStorage {
    private tokenKey;
    private refreshKey;
    private expiryKey;
    constructor(tokenKey?: string, refreshKey?: string, expiryKey?: string);
    token: string | null;
    refreshToken: string | null;
    expirationDate: Date | null;
    private setOrClearVar(key, val);
}
