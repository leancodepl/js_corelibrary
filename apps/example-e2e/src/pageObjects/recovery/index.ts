import { Locator, Page } from "@playwright/test"
import { CommonPage } from "../common"

export class RecoveryPage extends CommonPage {
    static readonly route = "/recovery"
    readonly wrapper: Locator

    // Email form
    readonly emailFormWrapper: Locator
    readonly emailInput: Locator
    readonly emailSubmitButton: Locator
    readonly emailFormErrors: Locator

    // Code form
    readonly codeFormWrapper: Locator
    readonly codeInput: Locator
    readonly codeSubmitButton: Locator
    readonly codeFormErrors: Locator

    // New password form
    readonly newPasswordFormWrapper: Locator
    readonly newPasswordInput: Locator
    readonly newPasswordConfirmationInput: Locator
    readonly newPasswordSubmitButton: Locator
    readonly newPasswordFormErrors: Locator

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

    // Email form actions
    async fillEmail(email: string) {
        await this.emailInput.fill(email)
    }

    async clickEmailSubmitButton() {
        await this.emailSubmitButton.click()
    }

    async getEmailFormErrors(): Promise<string[]> {
        return (await this.emailFormErrors.allTextContents()).filter(text => text.trim() !== "")
    }

    // Code form actions
    async fillCode(code: string) {
        await this.codeInput.fill(code)
    }

    async clickCodeSubmitButton() {
        await this.codeSubmitButton.click()
    }

    async getCodeFormErrors(): Promise<string[]> {
        return (await this.codeFormErrors.allTextContents()).filter(text => text.trim() !== "")
    }

    // New password form actions
    async fillNewPassword(password: string, confirmation: string) {
        await this.newPasswordInput.fill(password)
        await this.newPasswordConfirmationInput.fill(confirmation)
    }

    async clickNewPasswordSubmitButton() {
        await this.newPasswordSubmitButton.click()
    }

    async getNewPasswordFormErrors(): Promise<string[]> {
        return (await this.newPasswordFormErrors.allTextContents()).filter(text => text.trim() !== "")
    }
}
