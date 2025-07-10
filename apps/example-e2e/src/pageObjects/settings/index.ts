import { Locator, Page } from "@playwright/test"
import { CommonPage } from "../common"

export class SettingsPage extends CommonPage {
    static readonly route = "/settings"
    readonly wrapper: Locator

    // Traits form
    readonly traitsFormWrapper: Locator
    readonly emailVerificationRequiredInfo: Locator
    readonly emailInput: Locator
    readonly emailInputErrors: Locator
    readonly givenNameInput: Locator
    readonly givenNameInputErrors: Locator
    readonly traitsFormUpdateButton: Locator
    readonly traitsFormErrors: Locator

    // New password form
    readonly newPasswordFormWrapper: Locator
    readonly newPasswordInput: Locator
    readonly newPasswordInputErrors: Locator
    readonly newPasswordConfirmationInput: Locator
    readonly newPasswordConfirmationInputErrors: Locator
    readonly newPasswordFormSubmitButton: Locator
    readonly newPasswordFormErrors: Locator

    // Passkeys form
    readonly passkeysFormWrapper: Locator
    readonly addNewPasskeyButton: Locator
    readonly existingPasskeys: Locator
    readonly removePasskeyButton: Locator

    // TOTP form
    readonly totpFormLinkedWrapper: Locator
    readonly totpFormUnlinkedWrapper: Locator
    readonly totpSecretKey: Locator
    readonly totpCodeInput: Locator
    readonly totpCodeInputErrors: Locator
    readonly verifyTotpButton: Locator
    readonly unlinkTotpButton: Locator
    readonly totpFormErrors: Locator

    // OIDC form
    readonly oidcFormWrapper: Locator
    readonly appleButton: Locator
    readonly facebookButton: Locator
    readonly googleButton: Locator

    constructor(protected readonly page: Page) {
        super(page)

        this.wrapper = page.getByTestId("settings-page")

        // Traits form
        this.traitsFormWrapper = page.getByTestId("traits-form")
        this.emailVerificationRequiredInfo = this.traitsFormWrapper.getByTestId("email-verification-required-info")
        this.emailInput = this.traitsFormWrapper.getByTestId("email-input")
        this.emailInputErrors = this.traitsFormWrapper.locator(
            'input[data-testid="email-input"]~div[data-testid="input-errors"]',
        )
        this.givenNameInput = this.traitsFormWrapper.getByTestId("given-name-input")
        this.givenNameInputErrors = this.traitsFormWrapper.locator(
            'input[data-testid="given-name-input"]~div[data-testid="input-errors"]',
        )
        this.traitsFormUpdateButton = this.traitsFormWrapper.getByTestId("traits-form-update-button")
        this.traitsFormErrors = this.traitsFormWrapper.getByTestId("traits-form-errors")

        // New password form
        this.newPasswordFormWrapper = page.getByTestId("new-password-form")
        this.newPasswordInput = this.newPasswordFormWrapper.getByTestId("new-password-input")
        this.newPasswordInputErrors = this.newPasswordFormWrapper.locator(
            'input[data-testid="new-password-input"]~div[data-testid="input-errors"]',
        )
        this.newPasswordConfirmationInput = this.newPasswordFormWrapper.getByTestId("new-password-confirmation-input")
        this.newPasswordConfirmationInputErrors = this.newPasswordFormWrapper.locator(
            'input[data-testid="new-password-confirmation-input"]~div[data-testid="input-errors"]',
        )
        this.newPasswordFormSubmitButton = this.newPasswordFormWrapper.getByTestId("new-password-form-submit-button")
        this.newPasswordFormErrors = this.newPasswordFormWrapper.getByTestId("new-password-form-errors")

        // Passkeys form
        this.passkeysFormWrapper = page.getByTestId("passkeys-form")
        this.addNewPasskeyButton = this.passkeysFormWrapper.getByTestId("add-new-passkey-button")
        this.existingPasskeys = this.passkeysFormWrapper.getByTestId("existing-passkey")
        this.removePasskeyButton = this.passkeysFormWrapper.getByTestId("remove-passkey-button")

        // TOTP form
        this.totpFormLinkedWrapper = page.getByTestId("totp-form-linked")
        this.totpFormUnlinkedWrapper = page.getByTestId("totp-form-unlinked")
        this.totpSecretKey = this.totpFormUnlinkedWrapper.getByTestId("totp-secret-key")
        this.totpCodeInput = this.totpFormUnlinkedWrapper.getByTestId("totp-code-input")
        this.totpCodeInputErrors = this.totpFormUnlinkedWrapper.locator(
            'input[data-testid="totp-code-input"]~div[data-testid="input-errors"]',
        )
        this.verifyTotpButton = this.totpFormUnlinkedWrapper.getByTestId("verify-totp-button")
        this.unlinkTotpButton = this.totpFormLinkedWrapper.getByTestId("unlink-totp-button")
        this.totpFormErrors = this.totpFormUnlinkedWrapper.getByTestId("totp-form-errors")

        // OIDC form
        this.oidcFormWrapper = page.getByTestId("oidc-form")
        this.appleButton = this.oidcFormWrapper.getByTestId("apple-oidc-button")
        this.facebookButton = this.oidcFormWrapper.getByTestId("facebook-oidc-button")
        this.googleButton = this.oidcFormWrapper.getByTestId("google-oidc-button")
    }

    async visit() {
        await this.page.goto(SettingsPage.route)
    }

    async waitForSettingsFlowGetResponse(flowId?: string) {
        return this.page.waitForResponse(response =>
            response.url().includes(`/self-service/settings/flows?id=${flowId ?? ""}`),
        )
    }

    async waitForSettingsFlowUpdateResponse(flowId?: string) {
        return this.page.waitForResponse(response =>
            response.url().includes(`/self-service/settings?flow=${flowId ?? ""}`),
        )
    }

    async waitForSettingsFlowCreateResponse() {
        return this.page.waitForResponse(response => response.url().includes("self-service/settings/browser"))
    }

    // Traits form

    async fillEmail(email: string) {
        await this.emailInput.fill(email)
    }

    async fillGivenName(givenName: string) {
        await this.givenNameInput.fill(givenName)
    }

    async fillTraitsForm(email: string, givenName: string) {
        await this.fillEmail(email)
        await this.fillGivenName(givenName)
    }

    async clickTraitsFormUpdateButton() {
        await this.traitsFormUpdateButton.click()
    }

    async getTraitsFormErrors(): Promise<string[]> {
        return (await this.traitsFormErrors.allTextContents()).filter(text => text.trim() !== "")
    }

    // New password form

    async fillNewPasswordForm(password: string, confirmation: string) {
        await this.newPasswordInput.fill(password)
        await this.newPasswordConfirmationInput.fill(confirmation)
    }

    async clickNewPasswordFormSubmitButton() {
        await this.newPasswordFormSubmitButton.click()
    }

    async getNewPasswordFormErrors(): Promise<string[]> {
        return (await this.newPasswordFormErrors.allTextContents()).filter(text => text.trim() !== "")
    }

    // Passkeys form

    async clickAddNewPasskeyButton() {
        await this.addNewPasskeyButton.click()
    }

    async clickRemovePasskeyButton() {
        await this.removePasskeyButton.click()
    }

    // TOTP form

    async fillTotpCode(code: string) {
        await this.totpCodeInput.fill(code)
    }

    async clickVerifyTotpButton() {
        await this.verifyTotpButton.click()
    }

    async clickUnlinkTotpButton() {
        await this.unlinkTotpButton.click()
    }

    async getTotpFormErrors(): Promise<string[]> {
        return (await this.totpFormErrors.allTextContents()).filter(text => text.trim() !== "")
    }

    // OIDC form

    async clickAppleButton() {
        await this.appleButton.click()
    }

    async clickFacebookButton() {
        await this.facebookButton.click()
    }

    async clickGoogleButton() {
        await this.googleButton.click()
    }
}
