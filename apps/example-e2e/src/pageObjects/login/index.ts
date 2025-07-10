import { expect, Locator, Page } from "@playwright/test"
import { CommonPage } from "../common"

export class LoginPage extends CommonPage {
    static readonly route = "/login"
    readonly wrapper: Locator

    // Common locators
    readonly loginButton: Locator
    readonly errors: Locator

    // Choose method form
    readonly chooseMethodFormWrapper: Locator
    readonly forgotPasswordLink: Locator
    readonly existingIdentifier: Locator
    readonly identifierInput: Locator
    readonly passwordInput: Locator
    readonly googleButton: Locator
    readonly appleButton: Locator
    readonly facebookButton: Locator
    readonly passkeyButton: Locator

    // Second factor form
    readonly secondFactorFormWrapper: Locator
    readonly totpInput: Locator
    readonly continueWithEmailButton: Locator

    // Second factor email form
    readonly secondFactorEmailFormWrapper: Locator
    readonly secondFactorCodeInput: Locator
    readonly resendCodeButton: Locator

    // Email verification form
    readonly emailVerificationFormWrapper: Locator
    readonly emailVerificationCodeInput: Locator

    constructor(protected readonly page: Page) {
        super(page)

        this.wrapper = page.getByTestId("login-page")

        // Common locators
        this.loginButton = page.getByTestId("login-button")
        this.errors = page.getByTestId("errors")

        // Choose method form
        this.chooseMethodFormWrapper = page.getByTestId("choose-method-form")
        this.forgotPasswordLink = page.getByTestId("forgot-password-link")
        this.existingIdentifier = page.getByTestId("existing-identifier")
        this.identifierInput = page.getByTestId("identifier-input")
        this.passwordInput = page.getByTestId("password-input")
        this.googleButton = page.getByTestId("google-button")
        this.appleButton = page.getByTestId("apple-button")
        this.facebookButton = page.getByTestId("facebook-button")
        this.passkeyButton = page.getByTestId("passkey-button")

        // Second factor form
        this.secondFactorFormWrapper = page.getByTestId("second-factor-form")
        this.totpInput = page.getByTestId("totp-input")
        this.continueWithEmailButton = page.getByTestId("continue-with-email-button")

        // Second factor email form
        this.secondFactorEmailFormWrapper = page.getByTestId("second-factor-email-form")
        this.secondFactorCodeInput = page.getByTestId("second-factor-code-input")
        this.resendCodeButton = page.getByTestId("resend-code-button")

        // Email verification form
        this.emailVerificationFormWrapper = page.getByTestId("email-verification-form")
        this.emailVerificationCodeInput = page.getByTestId("email-verification-code-input")
    }

    async visit() {
        await this.page.goto(LoginPage.route)
    }

    async isVisible(): Promise<boolean> {
        return this.wrapper.isVisible()
    }

    async performCompleteLoginFlow(identifier: string, password: string) {
        await this.fillPasswordForm(identifier, password)
        await this.clickLogin()
        await expect(this.page).toHaveURL(/\/identity.*/)
    }

    // Choose method form

    async isChooseMethodFormVisible(): Promise<boolean> {
        return this.chooseMethodFormWrapper.isVisible()
    }

    async fillIdentifier(identifier: string) {
        await this.identifierInput.fill(identifier)
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password)
    }

    async fillPasswordForm(identifier: string, password: string) {
        await this.fillIdentifier(identifier)
        await this.fillPassword(password)
    }

    async clickLogin() {
        await this.loginButton.click()
    }

    async clickGoogle() {
        await this.googleButton.click()
    }

    async clickApple() {
        await this.appleButton.click()
    }

    async clickFacebook() {
        await this.facebookButton.click()
    }

    async clickPasskey() {
        await this.passkeyButton.click()
    }

    async clickForgotPassword() {
        await this.forgotPasswordLink.click()
    }

    async getErrors(): Promise<string[]> {
        return (await this.errors.allTextContents()).filter(text => text.trim() !== "")
    }

    // Second factor form

    async fillTotpInput(totpCode: string) {
        await this.totpInput.fill(totpCode)
    }
}
