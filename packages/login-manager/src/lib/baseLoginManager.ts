import { Buffer } from "node:buffer"
import { AsyncTokenStorage, Token, TokenStorage } from "./tokenStorage"

export interface LoginSuccess {
  readonly type: "success"
}

export interface LoginFailure {
  readonly type: "failure"
}

export interface LoginNetworkError {
  readonly type: "networkError"
}

export type LoginResult = LoginFailure | LoginNetworkError | LoginSuccess

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoginManager extends BaseLoginManager<TokenStorage> {}

const refreshLockKey = "token_refresh_lock"

export abstract class BaseLoginManager<TStorage extends TokenStorage> {
  private callbacks: ((isSignedIn: boolean) => void)[] = []
  private refreshTokenCallbacks: ((success: boolean) => void)[] = []
  private isRefreshingToken = false

  /* eslint-disable-next-line max-params */
  constructor(
    protected storage: TStorage,
    private endpoint: string,
    private clientSecret: string | undefined,
    private clientId: string,
    protected scopes: string,
    protected additionalParams?: Record<string, string>,
  ) {
    if (!clientSecret) {
      this.additionalParams = {
        ...additionalParams,
        client_id: clientId,
      }
    }
  }

  public abstract signOut(): TStorage extends AsyncTokenStorage ? Promise<void> : void

  public abstract isSigned(): TStorage extends AsyncTokenStorage ? Promise<boolean> : boolean

  public abstract getToken(): Promise<string | null>

  public trySignIn(username: string, password: string): Promise<LoginResult> {
    return this.acquireToken(this.buildSignInRequest(username, password))
  }

  public trySignInWithFacebook(accessToken: string): Promise<LoginResult> {
    return this.acquireToken(this.buildSignInWithFacebookRequest(accessToken))
  }

  public trySignInWithOneTimeToken(token: string): Promise<LoginResult> {
    return this.acquireToken(this.buildSignInWithOneTimeTokenRequest(token))
  }

  public trySignInWithGoogle(accessToken: string): Promise<LoginResult> {
    return this.acquireToken(this.buildSignInWithGoogleRequest(accessToken))
  }

  public trySignInWithLinkedIn(accessToken: string): Promise<LoginResult> {
    return this.acquireToken(this.buildSignInWithLinkedInRequest(accessToken))
  }

  public trySignInWithApple(accessToken: string): Promise<LoginResult> {
    return this.acquireToken(this.buildSignInWithAppleRequest(accessToken))
  }

  public async tryRefreshToken() {
    const token = await this.storage.getToken()
    if (token !== null) {
      return await this.tryRefreshTokenInternal(token)
    } else {
      return null
    }
  }

  protected async tryRefreshTokenInternal(token: Token): Promise<boolean> {
    if (typeof navigator !== "undefined" && "locks" in navigator) {
      return await this.tryRefreshWithLock(token)
    }

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true
      
      const executeRefresh = async () => {
        try {
          const result = await this.acquireToken(this.buildRefreshRequest(token))
          this.refreshTokenCallbacks.forEach(c => c(result.type === "success"))
        } catch {
          this.refreshTokenCallbacks.forEach(c => c(false))
        } finally {
          this.isRefreshingToken = false
          this.refreshTokenCallbacks = []
        }
      }
      
      executeRefresh()
    }

    return new Promise(resolve => {
      this.refreshTokenCallbacks.push(resolve)
    })
  }

  private async tryRefreshWithLock(token: Token): Promise<boolean> {
    return await navigator.locks.request(refreshLockKey, { ifAvailable: true }, async lock => {
      if (!lock) {
        return await this.waitForLockRelease()
      }

      try {
        const result = await this.acquireToken(this.buildRefreshRequest(token))
        return result.type === "success"
      } catch {
        return false
      }
    })
  }

  private async waitForLockRelease(): Promise<boolean> {
    return await navigator.locks.request(refreshLockKey, async () => {
      const currentToken = await this.storage.getToken()
      return currentToken !== null
    })
  }

  public onChange(callback: (isSignedIn: boolean) => void) {
    this.callbacks.push(callback)
  }

  public removeOnChange(callback: (isSignedIn: boolean) => void) {
    const idx = this.callbacks.indexOf(callback)
    if (idx !== -1) {
      this.callbacks.splice(idx, 1)
    }
  }

  public async acquireToken(init: RequestInit): Promise<LoginResult> {
    try {
      const result = await fetch(this.endpoint + "/connect/token", init)
      if (!result.ok) {
        if (result.status === 400) {
          await this.signOut()
        }
        return { type: "failure" }
      }

      const tokenResult = await result.json()

      const expDate = new Date()
      expDate.setSeconds(new Date().getSeconds() + tokenResult.expires_in)

      await this.storage.storeToken({
        token: tokenResult.access_token,
        refreshToken: tokenResult.refresh_token,
        expirationDate: expDate,
      })

      this.notify(true)
      return { type: "success" }
    } catch (error) {
      console.warn("Cannot call Auth server, error: ", error)
      return { type: "networkError" }
    }
  }

  public buildSignInRequest(username: string, password: string): RequestInit {
    const data: Record<string, string> = {
      grant_type: "password",
      scope: this.scopes,
      username: username,
      password: password,
      ...this.additionalParams,
    }

    return {
      method: "POST",
      headers: this.prepareHeaders(),
      body: new URLSearchParams(data),
    }
  }

  private buildSignInWithOneTimeTokenRequest(token: string): RequestInit {
    const data: Record<string, string> = {
      grant_type: "onetime",
      scope: this.scopes,
      token,
      ...this.additionalParams,
    }

    return {
      method: "POST",
      headers: this.prepareHeaders(),
      body: new URLSearchParams(data),
    }
  }

  public buildAssertionSignInRequest(accessToken: string, grantType: string): RequestInit {
    const data: Record<string, string> = {
      grant_type: grantType,
      scope: this.scopes,
      assertion: accessToken,
      ...this.additionalParams,
    }

    return {
      method: "POST",
      headers: this.prepareHeaders(),
      body: new URLSearchParams(data),
    }
  }

  private buildSignInWithFacebookRequest(accessToken: string): RequestInit {
    return this.buildAssertionSignInRequest(accessToken, "facebook")
  }

  private buildSignInWithGoogleRequest(accessToken: string): RequestInit {
    return this.buildAssertionSignInRequest(accessToken, "google")
  }

  private buildSignInWithLinkedInRequest(accessToken: string): RequestInit {
    return this.buildAssertionSignInRequest(accessToken, "linkedin")
  }

  private buildSignInWithAppleRequest(accessToken: string): RequestInit {
    return this.buildAssertionSignInRequest(accessToken, "apple")
  }

  private buildRefreshRequest(token: Token) {
    const data: Record<string, string> = {
      grant_type: "refresh_token",
      scope: this.scopes,
      refresh_token: token.refreshToken || "",
      ...this.additionalParams,
    }

    return {
      method: "POST",
      headers: this.prepareHeaders(),
      body: new URLSearchParams(data),
    }
  }

  protected prepareHeaders() {
    const headers = new Headers()
    if (this.clientSecret) {
      const sec = Buffer.from(`${this.clientId}:${this.clientSecret}`, "binary").toString("base64")
      headers.append("Authorization", "Basic " + sec)
    }

    headers.append("Content-Type", "application/x-www-form-urlencoded")
    return headers
  }

  protected notify(isSignedIn: boolean) {
    for (const c of this.callbacks) {
      c(isSignedIn)
    }
  }
}
