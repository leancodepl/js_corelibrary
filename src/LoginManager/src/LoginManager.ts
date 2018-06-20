/// <reference path="../TokenStorage.d.ts" />
import encode from "form-urlencoded";
import fetch from "cross-fetch";

declare var require: any;
let serialize: (str: string) => string;
if (typeof btoa === "undefined") {
    const Buffer = require("buffer").Buffer;

    serialize = str => new Buffer(str, "binary").toString("base64");
}
else {
    serialize = btoa;
}

export class CannotRefreshToken extends Error { }

export class LoginManager {
    private callbacks: (() => void)[] = [];
    private refreshTokenCallbacks: ((success: boolean) => void)[] = [];
    private isRefreshingToken: boolean = false;


    constructor(
        private storage: TokenStorage,
        private endpoint: string,
        private secret: string,
        private client: string,
        private scopes: string,
        private additionalParams?: any) {
    }

    public async signOut(): Promise<void> {
        await this.storage.resetToken();
        this.notify();
    }

    public async isSigned() {
        return await this.storage.getToken() !== null;
    }

    public async getToken() {
        let token = await this.storage.getToken();
        if (token === null) {
            throw new Error("Not signed in");
        }
        if (token.expirationDate < new Date()) {
            if (!await this.tryRefreshTokenInternal(token)) {
                throw new CannotRefreshToken("Cannot refresh access token after it has expired");
            }
        }
        return token.token;
    }

    public trySignIn(username: string, password: string): Promise<boolean> {
        return this.acquireToken(this.buildSignInRequest(username, password));
    }

    public trySignInWithFacebook(accessToken: string): Promise<boolean> {
        return this.acquireToken(this.buildSignInWithFacebookRequest(accessToken));
    }

    public async tryRefreshToken() {
        let token = await this.storage.getToken();
        if (token !== null) {
            return await this.tryRefreshTokenInternal(token);
        } else {
            return null;
        }
    }

    private tryRefreshTokenInternal(token: Token): Promise<boolean> {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.acquireToken(this.buildRefreshRequest(token)).then(
                success => {
                    this.refreshTokenCallbacks.forEach(c => c(success));
                    this.refreshTokenCallbacks = [];
                }
            );
        }

        return new Promise(resolve => {
            this.refreshTokenCallbacks.push(resolve);
        });
    }

    public onChange(callback: () => void) {
        this.callbacks.push(callback);
    }

    public removeOnChange(callback: () => void) {
        let idx = this.callbacks.indexOf(callback);
        if (idx !== -1) {
            this.callbacks.splice(idx, 1);
        }
    }

    private async acquireToken(init: RequestInit) {
        try {
            let result = await fetch(this.endpoint + "/connect/token", init);
            if (!result.ok) {
                if (result.status === 400) {
                    console.warn("Cannot sign user in, invalid username or password/refresh token, user will need to sign-in again");
                    this.signOut();
                } else {
                    console.error("Auth server returned an unknown error: %d %s", result.status, result.statusText);
                }
                return false;
            }

            let tokenResult = await result.json();

            let expDate = new Date();
            expDate.setSeconds(new Date().getSeconds() + tokenResult.expires_in);
            this.storage.storeToken({
                token: tokenResult.access_token,
                refreshToken: tokenResult.refresh_token,
                expirationDate: expDate
            });

            this.notify();
            return true;
        } catch (e) {
            console.warn("Cannot call Auth server ", e);
            return false;
        }
    }

    public buildSignInRequest(username: string, password: string): RequestInit {
        let data = {
            "grant_type": "password",
            "scope": this.scopes,
            "username": username,
            "password": password
        };
        if (this.additionalParams) {
            data = {
                ...this.additionalParams,
                ...data
            };
        }
        let params = encode(data);
        return {
            method: "POST",
            headers: this.prepareHeaders(),
            body: params
        };
    }

    private buildSignInWithFacebookRequest(accessToken: string): RequestInit {
        let data = {
            "grant_type": "facebook",
            "scope": this.scopes,
            "assertion": accessToken
        };
        if (this.additionalParams) {
            data = {
                ...this.additionalParams,
                ...data
            };
        }
        let params = encode(data);
        return {
            method: "POST",
            headers: this.prepareHeaders(),
            body: params
        };
    }

    private buildRefreshRequest(token: Token) {
        let params = encode({
            "grant_type": "refresh_token",
            "scope": this.scopes,
            "refresh_token": token.refreshToken || ""
        });

        return {
            method: "POST",
            headers: this.prepareHeaders(),
            body: params
        };
    }

    private prepareHeaders() {
        let headers = new Headers();
        let sec = serialize(this.client + ":" + this.secret);
        headers.append("Authorization", "Basic " + sec);
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        return headers;
    }

    private notify() {
        for (let c of this.callbacks) {
            c();
        }
    }
}
