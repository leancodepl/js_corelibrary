import "cross-fetch/polyfill";
import encode from "form-urlencoded";
import { AsyncTokenStorage, Token, TokenStorage } from "./TokenStorage";

declare var require: any;
let serialize: (str: string) => string;
if (typeof btoa === "undefined") {
    const Buffer = require("buffer").Buffer;

    serialize = str => new Buffer(str, "binary").toString("base64");
}
else {
    serialize = btoa;
}

export interface LoginSuccess {
    readonly type: "success";
}

export interface LoginFailure {
    readonly type: "failure";
}

export interface LoginNetworkError {
    readonly type: "networkError";
}

export type LoginResult = LoginSuccess | LoginFailure | LoginNetworkError;

export interface LoginManager extends BaseLoginManager<TokenStorage> {
}

export abstract class BaseLoginManager<TStorage extends TokenStorage> {
    private callbacks: ((isSignedIn: boolean) => void)[] = [];
    private refreshTokenCallbacks: ((success: boolean) => void)[] = [];
    private isRefreshingToken: boolean = false;

    constructor(
        protected storage: TStorage,
        private endpoint: string,
        private secret: string,
        private client: string,
        private scopes: string,
        private additionalParams?: any) {
    }

    public abstract signOut(): TStorage extends AsyncTokenStorage ? Promise<void> : void;

    public abstract isSigned(): TStorage extends AsyncTokenStorage ? Promise<boolean> : boolean;

    public abstract getToken(): Promise<string | null>;

    public trySignIn(username: string, password: string): Promise<LoginResult> {
        return this.acquireToken(this.buildSignInRequest(username, password));
    }

    public trySignInWithFacebook(accessToken: string): Promise<LoginResult> {
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

    protected tryRefreshTokenInternal(token: Token): Promise<boolean> {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.acquireToken(this.buildRefreshRequest(token)).then(
                result => {
                    this.isRefreshingToken = false;
                    this.refreshTokenCallbacks.forEach(c => c(result.type === "success"));
                    this.refreshTokenCallbacks = [];
                }
            );
        }

        return new Promise(resolve => {
            this.refreshTokenCallbacks.push(resolve);
        });
    }

    public onChange(callback: (isSignedIn: boolean) => void) {
        this.callbacks.push(callback);
    }

    public removeOnChange(callback: () => void) {
        let idx = this.callbacks.indexOf(callback);
        if (idx !== -1) {
            this.callbacks.splice(idx, 1);
        }
    }

    private async acquireToken(init: RequestInit): Promise<LoginResult> {
        try {
            let result = await fetch(this.endpoint + "/connect/token", init);
            if (!result.ok) {
                if (result.status === 400) {
                    this.signOut();
                }
                return { type: "failure" };
            }

            let tokenResult = await result.json();

            let expDate = new Date();
            expDate.setSeconds(new Date().getSeconds() + tokenResult.expires_in);
            this.storage.storeToken({
                token: tokenResult.access_token,
                refreshToken: tokenResult.refresh_token,
                expirationDate: expDate
            });

            this.notify(true);
            return { type: "success" };
        } catch (e) {
            console.warn("Cannot call Auth server, error: ", e);
            return { type: "networkError" };
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

    protected notify(isSignedIn: boolean) {
        for (let c of this.callbacks) {
            c(isSignedIn);
        }
    }
}
