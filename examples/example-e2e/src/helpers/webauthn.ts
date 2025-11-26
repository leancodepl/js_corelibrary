import { BrowserContext, Page } from "@playwright/test"

export class WebAuthnHelper {
  private authenticatorId: null | string = null
  private client: any

  constructor(
    private page: Page,
    private context: BrowserContext,
  ) {}

  async setupWebAuthnEnvironment() {
    this.client = await this.context.newCDPSession(this.page)

    await this.client.send("WebAuthn.enable")

    const result = await this.client.send("WebAuthn.addVirtualAuthenticator", {
      options: {
        protocol: "ctap2",
        transport: "internal",
        hasResidentKey: false,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    })

    this.authenticatorId = result.authenticatorId
  }

  async setUserVerified(isVerified: boolean) {
    if (!this.authenticatorId || !this.client) {
      throw new Error("Authenticator not initialized.")
    }

    await this.client.send("WebAuthn.setUserVerified", {
      authenticatorId: this.authenticatorId,
      isUserVerified: isVerified,
    })
  }

  async removeAuthenticator() {
    if (!this.authenticatorId || !this.client) {
      return
    }

    await this.client.send("WebAuthn.removeVirtualAuthenticator", {
      authenticatorId: this.authenticatorId,
    })

    this.authenticatorId = null
  }
}
