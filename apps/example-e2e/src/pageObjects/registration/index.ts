import { Locator, Page } from "@playwright/test"
import { CommonPage } from "../common"

export class RegistrationPage extends CommonPage {
    static readonly route = "/registration"
    readonly wrapper: Locator
    readonly alreadyLoggedInWrapper: Locator

    // Common locators
    readonly registerButton: Locator
    readonly errors: Locator

    // Traits form
    readonly traitsFormWrapper: Locator
    readonly emailInput: Locator
    readonly emailInputErrors: Locator
    readonly givenNameInput: Locator
    readonly regulationsCheckbox: Locator
    readonly regulationsCheckboxErrors: Locator
    readonly googleButton: Locator
    readonly appleButton: Locator
    readonly facebookButton: Locator

    // Choose method form
    readonly chooseMethodFormWrapper: Locator
    readonly returnButton: Locator
    readonly passwordInput: Locator
    readonly passwordInputErrors: Locator
    readonly passwordConfirmationInput: Locator
    readonly passwordConfirmationInputErrors: Locator
    readonly passkeyButton: Locator

    // Email verification form
    readonly emailVerificationFormWrapper: Locator
    readonly emailVerificationCodeInput: Locator
    readonly emailVerificationSubmitButton: Locator
    readonly emailVerificationResendButton: Locator

    constructor(protected readonly page: Page) {
        super(page)

        this.wrapper = page.getByTestId("registration-page")
        this.alreadyLoggedInWrapper = page.getByTestId("already-logged-in")

        // Common
        this.registerButton = page.getByTestId("register-button")
        this.errors = page.getByTestId("errors")

        // Traits form
        this.traitsFormWrapper = page.getByTestId("traits-form")
        this.emailInput = this.traitsFormWrapper.getByTestId("email-input")
        this.emailInputErrors = this.traitsFormWrapper.locator(
            'input[data-testid="email-input"]~div[data-testid="input-errors"]',
        )
        this.givenNameInput = this.traitsFormWrapper.getByTestId("given-name-input")
        this.regulationsCheckbox = this.traitsFormWrapper.getByTestId("regulations-checkbox")
        this.regulationsCheckboxErrors = this.regulationsCheckbox.locator(
            'xpath=ancestor::div[1]//div[@data-testid="checkbox-errors"]',
        )
        this.googleButton = this.traitsFormWrapper.getByTestId("google-signup-button")
        this.appleButton = this.traitsFormWrapper.getByTestId("apple-signup-button")
        this.facebookButton = this.traitsFormWrapper.getByTestId("facebook-signup-button")

        // Choose method form
        this.chooseMethodFormWrapper = page.getByTestId("choose-method-form")
        this.returnButton = this.chooseMethodFormWrapper.getByTestId("return-button")
        this.passwordInput = this.chooseMethodFormWrapper.getByTestId("password-input")
        this.passwordInputErrors = this.chooseMethodFormWrapper.locator(
            'input[data-testid="password-input"]~div[data-testid="input-errors"]',
        )
        this.passwordConfirmationInput = this.chooseMethodFormWrapper.getByTestId("password-confirmation-input")
        this.passwordConfirmationInputErrors = this.chooseMethodFormWrapper.locator(
            'input[data-testid="password-confirmation-input"]~div[data-testid="input-errors"]',
        )
        this.passkeyButton = this.chooseMethodFormWrapper.getByTestId("passkey-signup-button")

        // Email verification form
        this.emailVerificationFormWrapper = page.getByTestId("email-verification-form")
        this.emailVerificationCodeInput = this.emailVerificationFormWrapper.getByTestId("email-verification-code-input")
        this.emailVerificationSubmitButton = this.emailVerificationFormWrapper.getByTestId(
            "email-verification-submit-button",
        )
        this.emailVerificationResendButton = this.emailVerificationFormWrapper.getByTestId(
            "email-verification-resend-button",
        )
    }

    async visit(initialFlowId: string | null = null) {
        await this.page.goto(RegistrationPage.route + (initialFlowId ? `?flow=${initialFlowId}` : ""))
    }

    // Common

    async clickRegisterButton() {
        await this.registerButton.click()
    }

    async getErrors(): Promise<string[]> {
        return (await this.errors.allTextContents()).filter(text => text.trim() !== "")
    }

    // Traits form

    async fillTraitsForm(email: string, givenName: string, regulationsAccepted: boolean) {
        await this.emailInput.fill(email)
        await this.givenNameInput.fill(givenName)
        if (regulationsAccepted) {
            await this.regulationsCheckbox.check()
        }
    }

    async clickGoogleButton() {
        await this.googleButton.click()
    }

    async clickAppleButton() {
        await this.appleButton.click()
    }

    async clickFacebookButton() {
        await this.facebookButton.click()
    }

    // Choose method form

    async fillChooseMethodForm(password: string, passwordConfirmation: string) {
        await this.passwordInput.fill(password)
        await this.passwordConfirmationInput.fill(passwordConfirmation)
    }

    async clickReturnButton() {
        await this.returnButton.click()
    }

    async clickPasskeyButton() {
        await this.passkeyButton.click()
    }

    async waitForRegistrationFlowGetResponse(flowId?: string) {
        return this.page.waitForResponse(response =>
            response.url().includes(`/self-service/registration/flows?id=${flowId ?? ""}`),
        )
    }

    async waitForRegistrationFlowUpdateResponse(flowId?: string) {
        return this.page.waitForResponse(response =>
            response.url().includes(`/self-service/registration?flow=${flowId ?? ""}`),
        )
    }

    async waitForRegistrationFlowCreateResponse() {
        return this.page.waitForResponse(response => response.url().includes("self-service/registration/browser"))
    }

    // Email verification form

    async fillEmailVerificationCode(code: string) {
        await this.emailVerificationCodeInput.fill(code)
    }

    async clickEmailVerificationSubmitButton() {
        await this.emailVerificationSubmitButton.click()
    }

    async clickEmailVerificationResendButton() {
        await this.emailVerificationResendButton.click()
    }
}
