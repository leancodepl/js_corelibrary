import { dataTestIds } from "@example/e2e-ids"
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

    this.wrapper = page.getByTestId(dataTestIds.recovery.page)

    // Email form
    this.emailFormWrapper = page.getByTestId(dataTestIds.recovery.emailForm.wrapper)
    this.emailInput = this.emailFormWrapper.getByTestId(dataTestIds.recovery.emailForm.emailInput)
    this.emailSubmitButton = this.emailFormWrapper.getByTestId(dataTestIds.recovery.emailForm.submitButton)
    this.emailFormErrors = this.emailFormWrapper.getByTestId(dataTestIds.common.errors)

    // Code form
    this.codeFormWrapper = page.getByTestId(dataTestIds.recovery.codeForm.wrapper)
    this.codeInput = this.codeFormWrapper.getByTestId(dataTestIds.recovery.codeForm.codeInput)
    this.codeSubmitButton = this.codeFormWrapper.getByTestId(dataTestIds.recovery.codeForm.submitButton)
    this.codeFormErrors = this.codeFormWrapper.getByTestId(dataTestIds.common.errors)

    // New password form
    this.newPasswordFormWrapper = page.getByTestId(dataTestIds.recovery.newPasswordForm.wrapper)
    this.newPasswordInput = this.newPasswordFormWrapper.getByTestId(
      dataTestIds.recovery.newPasswordForm.newPasswordInput,
    )
    this.newPasswordConfirmationInput = this.newPasswordFormWrapper.getByTestId(
      dataTestIds.recovery.newPasswordForm.newPasswordConfirmationInput,
    )
    this.newPasswordSubmitButton = this.newPasswordFormWrapper.getByTestId(
      dataTestIds.recovery.newPasswordForm.submitButton,
    )
    this.newPasswordFormErrors = this.newPasswordFormWrapper.getByTestId(dataTestIds.common.errors)
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
    const errors = await this.emailFormErrors.allTextContents()
    return errors.filter(text => text.trim() !== "")
  }

  // Code form

  async fillCode(code: string) {
    await this.codeInput.fill(code)
  }

  async clickCodeSubmitButton() {
    await this.codeSubmitButton.click()
  }

  async getCodeFormErrors() {
    const errors = await this.codeFormErrors.allTextContents()
    return errors.filter(text => text.trim() !== "")
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
    const errors = await this.newPasswordFormErrors.allTextContents()
    return errors.filter(text => text.trim() !== "")
  }
}
