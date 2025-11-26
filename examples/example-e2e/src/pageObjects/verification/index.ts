import { dataTestIds } from "@example/e2e-ids"
import { Page } from "@playwright/test"
import { CommonPage } from "../common"

export class VerificationPage extends CommonPage {
  static readonly route = "/verification"
  readonly wrapper

  // Email verification form
  readonly emailVerificationFormWrapper
  readonly verificationCodeInput
  readonly verifyButton
  readonly resendCodeButton
  readonly errors

  constructor(protected override readonly page: Page) {
    super(page)

    this.wrapper = page.getByTestId(dataTestIds.verification.page)

    // Email verification form
    this.emailVerificationFormWrapper = page.getByTestId(dataTestIds.verification.emailVerificationForm.wrapper)
    this.verificationCodeInput = this.emailVerificationFormWrapper.getByTestId(
      dataTestIds.verification.emailVerificationForm.codeInput,
    )
    this.verifyButton = this.emailVerificationFormWrapper.getByTestId(
      dataTestIds.verification.emailVerificationForm.submitButton,
    )
    this.resendCodeButton = this.emailVerificationFormWrapper.getByTestId(
      dataTestIds.verification.emailVerificationForm.resendButton,
    )
    this.errors = this.emailVerificationFormWrapper.getByTestId(dataTestIds.common.errors)
  }

  async visit(initialFlowId: null | string = null) {
    await this.page.goto(VerificationPage.route + (initialFlowId ? `?flow=${initialFlowId}` : ""))
  }

  // Email verification form

  async fillVerificationCode(code: string) {
    await this.verificationCodeInput.fill(code)
  }

  async clickVerifyButton() {
    await this.verifyButton.click()
  }

  async clickResendCodeButton() {
    await this.resendCodeButton.click()
  }

  async getErrors() {
    return (await this.errors.allTextContents()).filter(text => text.trim() !== "")
  }
}
