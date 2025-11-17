/// <reference types="facebook-js-sdk" />

/**
 * Integrates Facebook Login SDK for web applications.
 *
 * Handles Facebook authentication flow and provides access tokens for OAuth2 sign-in.
 * Automatically loads Facebook SDK and manages login state.
 *
 * @param facebookAppId - Facebook App ID
 * @param facebookPermissions - Comma-separated Facebook permissions
 * @example
 * ```typescript
 * const facebookClient = new FacebookClient('your-app-id', 'email,public_profile');
 * facebookClient.setup();
 * facebookClient.login((accessToken) => {
 *   return loginManager.trySignInWithFacebook(accessToken);
 * });
 * ```
 */
export class FacebookClient {
  public isSignedIn?: boolean
  private token: string

  constructor(
    private facebookAppId: string,
    private facebookPermissions: string,
  ) {
    this.isSignedIn = undefined
    this.token = ""
  }

  public get accessToken(): string {
    return this.token
  }

  public setup(loginCallback?: (accessToken: string) => Promise<void>): void {
    const ref = document.getElementsByTagName("script")[0]
    const id = "facebook-jssdk"

    if (document.getElementById(id)) {
      this.initializeSDK()
      this.getLoginStatus(loginCallback)
      return
    }

    const js = document.createElement("script")
    js.id = id
    js.async = true
    js.src = "//connect.facebook.net/pl_PL/sdk.js"
    if (ref.parentNode != null) {
      ref.parentNode.insertBefore(js, ref)
    }
    js.onload = () => {
      this.initializeSDK()
      this.getLoginStatus(loginCallback)
    }
  }

  public login(callback?: (accessToken: string) => Promise<void>) {
    FB.login(
      response => {
        if (response.status === "connected") {
          this.isSignedIn = true
          this.token = response.authResponse.accessToken
          if (callback) {
            callback(response.authResponse.accessToken)
          }
        } else {
          this.isSignedIn = false
        }
      },
      { scope: this.facebookPermissions },
    )
  }

  private getLoginStatus(callback?: (accessToken: string) => Promise<void>) {
    FB.getLoginStatus(response => {
      if (response.status === "connected") {
        this.isSignedIn = true
        this.token = response.authResponse.accessToken
        if (callback) {
          callback(response.authResponse.accessToken)
        }
      } else {
        this.isSignedIn = false
      }
    })
  }

  private initializeSDK() {
    FB.init({
      appId: this.facebookAppId,
      xfbml: true,
      version: "v2.9",
    })
  }
}
