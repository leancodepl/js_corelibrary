import { Page } from "@playwright/test"
import { CommonPage } from "../common"

export class RecoveryPage extends CommonPage {
    static readonly route = "/recovery"
    readonly wrapper

    // Email form
    readonly emailFormWrapper
    readonly emailInput
    readonly emailSubmitButton
    readonly emailFormErrors

    // Code form
    readonly codeFormWrapper
    readonly codeInput
    readonly codeSubmitButton
    readonly codeFormErrors

    // New password form
    readonly newPasswordFormWrapper
    readonly newPasswordInput
    readonly newPasswordConfirmationInput
    readonly newPasswordSubmitButton
    readonly newPasswordFormErrors

    constructor(protected readonly page: Page) {
        super(page)

        this.wrapper = page.getByTestId("recovery-page")

        // Email form
        this.emailFormWrapper = page.getByTestId("email-form")
        this.emailInput = this.emailFormWrapper.getByTestId("email-input")
        this.emailSubmitButton = this.emailFormWrapper.getByTestId("email-submit-button")
        this.emailFormErrors = this.emailFormWrapper.getByTestId("errors")

        // Code form
        this.codeFormWrapper = page.getByTestId("code-form")
        this.codeInput = this.codeFormWrapper.getByTestId("code-input")
        this.codeSubmitButton = this.codeFormWrapper.getByTestId("code-submit-button")
        this.codeFormErrors = this.codeFormWrapper.getByTestId("errors")

        // New password form
        this.newPasswordFormWrapper = page.getByTestId("new-password-form")
        this.newPasswordInput = this.newPasswordFormWrapper.getByTestId("new-password-input")
        this.newPasswordConfirmationInput = this.newPasswordFormWrapper.getByTestId("new-password-confirmation-input")
        this.newPasswordSubmitButton = this.newPasswordFormWrapper.getByTestId("new-password-submit-button")
        this.newPasswordFormErrors = this.newPasswordFormWrapper.getByTestId("errors")
    }

    async visit() {
        await this.page.goto(RecoveryPage.route)
    }

    // Email form

    async fillEmail(email: string) {
        await this.emailInput.fill(email)
    }

    async clickEmailSubmitButton() {
        await this.emailSubmitButton.click()
    }

    async getEmailFormErrors() {
        return (await this.emailFormErrors.allTextContents()).filter(text => text.trim() !== "")
    }

    // Code form

    async fillCode(code: string) {
        await this.codeInput.fill(code)
    }

    async clickCodeSubmitButton() {
        await this.codeSubmitButton.click()
    }

    async getCodeFormErrors() {
        return (await this.codeFormErrors.allTextContents()).filter(text => text.trim() !== "")
    }

    // New password form

    async fillNewPassword(password: string, confirmation: string) {
        await this.newPasswordInput.fill(password)
        await this.newPasswordConfirmationInput.fill(confirmation)
    }

    async clickNewPasswordSubmitButton() {
        await this.newPasswordSubmitButton.click()
    }

    async getNewPasswordFormErrors() {
        return (await this.newPasswordFormErrors.allTextContents()).filter(text => text.trim() !== "")
    }
}
