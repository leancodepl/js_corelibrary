import { dataTestIds } from "@example/e2e-ids"
import { expect, Page } from "@playwright/test"
import { CommonPage } from "../common"

export class LoginPage extends CommonPage {
  static readonly route = "/login"
  readonly wrapper

  // Common locators
  readonly loginButton
  readonly errors

  // Choose method form
  readonly chooseMethodFormWrapper
  readonly forgotPasswordLink
  readonly existingIdentifier
  readonly identifierInput
  readonly passwordInput
  readonly googleButton
  readonly appleButton
  readonly facebookButton
  readonly passkeyButton

  // Second factor form
  readonly secondFactorFormWrapper
  readonly totpInput
  readonly continueWithEmailButton

  // Second factor email form
  readonly secondFactorEmailFormWrapper
  readonly secondFactorCodeInput
  readonly resendCodeButton

  // Email verification form
  readonly emailVerificationFormWrapper
  readonly emailVerificationCodeInput

  constructor(protected readonly page: Page) {
    super(page)

    this.wrapper = page.getByTestId(dataTestIds.login.page)

    // Common locators
    this.loginButton = page.getByTestId(dataTestIds.login.common.loginButton)
    this.errors = page.getByTestId(dataTestIds.common.errors)

    // Choose method form
    this.chooseMethodFormWrapper = page.getByTestId(dataTestIds.login.chooseMethodForm.wrapper)
    this.forgotPasswordLink = page.getByTestId(dataTestIds.login.chooseMethodForm.forgotPasswordLink)
    this.existingIdentifier = page.getByTestId(dataTestIds.login.chooseMethodForm.existingIdentifier)
    this.identifierInput = page.getByTestId(dataTestIds.login.chooseMethodForm.identifierInput)
    this.passwordInput = page.getByTestId(dataTestIds.login.chooseMethodForm.passwordInput)
    this.googleButton = page.getByTestId(dataTestIds.login.chooseMethodForm.googleButton)
    this.appleButton = page.getByTestId(dataTestIds.login.chooseMethodForm.appleButton)
    this.facebookButton = page.getByTestId(dataTestIds.login.chooseMethodForm.facebookButton)
    this.passkeyButton = page.getByTestId(dataTestIds.login.chooseMethodForm.passkeyButton)

    // Second factor form
    this.secondFactorFormWrapper = page.getByTestId(dataTestIds.login.secondFactorForm.wrapper)
    this.totpInput = page.getByTestId(dataTestIds.login.secondFactorForm.totpInput)
    this.continueWithEmailButton = page.getByTestId(dataTestIds.login.secondFactorForm.continueWithEmailButton)

    // Second factor email form
    this.secondFactorEmailFormWrapper = page.getByTestId(dataTestIds.login.secondFactorEmailForm.wrapper)
    this.secondFactorCodeInput = page.getByTestId(dataTestIds.login.secondFactorEmailForm.codeInput)
    this.resendCodeButton = page.getByTestId(dataTestIds.login.secondFactorEmailForm.resendCodeButton)

    // Email verification form
    this.emailVerificationFormWrapper = page.getByTestId(dataTestIds.login.emailVerificationForm.wrapper)
    this.emailVerificationCodeInput = page.getByTestId(dataTestIds.login.emailVerificationForm.codeInput)
  }

  async visit() {
    await this.page.goto(LoginPage.route)
  }

  async isVisible() {
    return this.wrapper.isVisible()
  }

  async performCompleteLoginFlow(identifier: string, password: string) {
    await this.fillPasswordForm(identifier, password)
    await this.clickLogin()
    await expect(this.page).toHaveURL(/\/identity.*/)
  }

  // Choose method form

  async isChooseMethodFormVisible() {
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

  async getErrors() {
    const errors = await this.errors.allTextContents()
    return errors.filter(text => text.trim() !== "")
  }

  // Second factor form

  async fillTotpInput(totpCode: string) {
    await this.totpInput.fill(totpCode)
  }
}
