/// <reference path="../TokenStorage.d.ts" />
import * as encode from "form-urlencoded";

export class CannotRefreshToken extends Error { }

export class LoginManager {
    private callbacks: (() => void)[] = [];

    constructor(
        private storage: TokenStorage,
        private endpoint: string,
        private secret: string,
        private client: string,
        private scopes: string) {
    }

    public signOut() {
        this.storage.token = null;
        this.storage.refreshToken = null;
        this.storage.expirationDate = null;

        this.notify();
    }

    public get isSigned() {
        return this.storage.token !== null;
    }

    public async getToken() {
        if (!this.storage.token) {
            throw new Error("Not signed in");
        }
        if (this.storage.expirationDate && this.storage.expirationDate < new Date()) {
            if (!await this.tryRefreshToken()) {
                throw new CannotRefreshToken("Cannot refresh access token after it has expired");
            }
        }
        return this.storage.token;
    }

    public trySignIn(username: string, password: string): Promise<boolean> {
        return this.acquireToken(this.buildSignInRequest(username, password));
    }

    public trySignInWithFacebook(accessToken: string): Promise<boolean> {
        return this.acquireToken(this.buildSignInWithFacebookRequest(accessToken));
    }

    public async tryRefreshToken(): Promise<boolean> {
        return this.acquireToken(this.buildRefreshRequest());
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

            this.storage.token = tokenResult.access_token;
            this.storage.refreshToken = tokenResult.refresh_token;

            let expDate = new Date();
            expDate.setSeconds(new Date().getSeconds() + tokenResult.expires_in);
            this.storage.expirationDate = expDate;

            this.notify();
            return true;
        } catch (e) {
            console.warn("Cannot call Auth server ", e);
            return false;
        }
    }

    private buildSignInRequest(username: string, password: string): RequestInit {
        let params = encode({
            "grant_type": "password",
            "scope": this.scopes,
            "username": username,
            "password": password
        });
        return {
            method: "POST",
            headers: this.prepareHeaders(),
            body: params
        };
    }

    private buildSignInWithFacebookRequest(accessToken: string): RequestInit {
        let params = encode({
            "grant_type": "facebook",
            "scope": this.scopes,
            "assertion": accessToken
        });
        return {
            method: "POST",
            headers: this.prepareHeaders(),
            body: params
        };
    }

    private buildRefreshRequest() {
        let params = encode({
            "grant_type": "refresh_token",
            "scope": this.scopes,
            "refresh_token": this.storage.refreshToken || ""
        });

        return {
            method: "POST",
            headers: this.prepareHeaders(),
            body: params
        };
    }

    private prepareHeaders() {
        let headers = new Headers();
        let sec = btoa(this.client + ":" + this.secret);
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
