import { Locator, Page } from "@playwright/test"
import { CommonPage } from "../common"

export class VerificationPage extends CommonPage {
    static readonly route = "/verification"
    readonly wrapper: Locator

    // Email verification form
    readonly emailVerificationFormWrapper
    readonly verificationCodeInput: Locator
    readonly verifyButton: Locator
    readonly resendCodeButton: Locator
    readonly errors: Locator

    constructor(protected readonly page: Page) {
        super(page)

        this.wrapper = page.getByTestId("verification-page")

        // Email verification form
        this.emailVerificationFormWrapper = page.getByTestId("email-verification-form")
        this.verificationCodeInput = this.emailVerificationFormWrapper.getByTestId("verification-code-input")
        this.verifyButton = this.emailVerificationFormWrapper.getByTestId("verify-button")
        this.resendCodeButton = this.emailVerificationFormWrapper.getByTestId("resend-code-button")
        this.errors = this.emailVerificationFormWrapper.getByTestId("errors")
    }

    async visit(initialFlowId: string | null = null) {
        await this.page.goto(VerificationPage.route + (initialFlowId ? `?flow=${initialFlowId}` : ""))
    }

    async fillVerificationCode(code: string) {
        await this.verificationCodeInput.fill(code)
    }

    async clickVerifyButton() {
        await this.verifyButton.click()
    }

    async clickResendCodeButton() {
        await this.resendCodeButton.click()
    }

    async getErrors(): Promise<string[]> {
        return (await this.errors.allTextContents()).filter(text => text.trim() !== "")
    }
}
