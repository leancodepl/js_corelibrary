/// <reference path="TokenStorage.d.ts" />
export declare class CannotRefreshToken extends Error {
}
export declare class LoginManager {
    private storage;
    private endpoint;
    private secret;
    private client;
    private scopes;
    private callbacks;
    constructor(storage: TokenStorage, endpoint: string, secret: string, client: string, scopes: string);
    signOut(): void;
    readonly isSigned: boolean;
    getToken(): Promise<string>;
    trySignIn(username: string, password: string): Promise<boolean>;
    trySignInWithFacebook(accessToken: string): Promise<boolean>;
    tryRefreshToken(): Promise<boolean>;
    onChange(callback: () => void): void;
    removeOnChange(callback: () => void): void;
    private acquireToken(init);
    private buildSignInRequest(username, password);
    private buildSignInWithFacebookRequest(accessToken);
    private buildRefreshRequest();
    private prepareHeaders();
    private notify();
}
