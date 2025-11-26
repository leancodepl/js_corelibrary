import { dataTestIds } from "@example/e2e-ids"
import { Page } from "@playwright/test"
import { getCheckboxErrors, getInputErrors } from "../../helpers/locators"
import { CommonPage } from "../common"

export class RegistrationPage extends CommonPage {
  static readonly route = "/registration"
  readonly wrapper
  readonly alreadyLoggedInWrapper

  // Common locators
  readonly registerButton
  readonly errors

  // Traits form
  readonly traitsFormWrapper
  readonly emailInput
  readonly emailInputErrors
  readonly givenNameInput
  readonly regulationsCheckbox
  readonly regulationsCheckboxErrors
  readonly googleButton
  readonly appleButton
  readonly facebookButton

  // Choose method form
  readonly chooseMethodFormWrapper
  readonly returnButton
  readonly passwordInput
  readonly passwordInputErrors
  readonly passwordConfirmationInput
  readonly passwordConfirmationInputErrors
  readonly passkeyButton

  // Email verification form
  readonly emailVerificationFormWrapper
  readonly emailVerificationCodeInput
  readonly emailVerificationSubmitButton
  readonly emailVerificationResendButton

  constructor(protected override readonly page: Page) {
    super(page)

    this.wrapper = page.getByTestId(dataTestIds.registration.page)
    this.alreadyLoggedInWrapper = page.getByTestId(dataTestIds.registration.alreadyLoggedIn)

    // Common
    this.registerButton = page.getByTestId(dataTestIds.registration.common.registerButton)
    this.errors = page.getByTestId(dataTestIds.common.errors)

    // Traits form
    this.traitsFormWrapper = page.getByTestId(dataTestIds.registration.traitsForm.wrapper)
    this.emailInput = this.traitsFormWrapper.getByTestId(dataTestIds.registration.traitsForm.emailInput)
    this.emailInputErrors = getInputErrors(this.emailInput)
    this.givenNameInput = this.traitsFormWrapper.getByTestId(dataTestIds.registration.traitsForm.givenNameInput)
    this.regulationsCheckbox = this.traitsFormWrapper.getByTestId(
      dataTestIds.registration.traitsForm.regulationsCheckbox,
    )
    this.regulationsCheckboxErrors = getCheckboxErrors(this.regulationsCheckbox)
    this.googleButton = this.traitsFormWrapper.getByTestId(dataTestIds.registration.traitsForm.googleButton)
    this.appleButton = this.traitsFormWrapper.getByTestId(dataTestIds.registration.traitsForm.appleButton)
    this.facebookButton = this.traitsFormWrapper.getByTestId(dataTestIds.registration.traitsForm.facebookButton)

    // Choose method form
    this.chooseMethodFormWrapper = page.getByTestId(dataTestIds.registration.chooseMethodForm.wrapper)
    this.returnButton = this.chooseMethodFormWrapper.getByTestId(dataTestIds.registration.chooseMethodForm.returnButton)
    this.passwordInput = this.chooseMethodFormWrapper.getByTestId(
      dataTestIds.registration.chooseMethodForm.passwordInput,
    )
    this.passwordInputErrors = getInputErrors(this.passwordInput)
    this.passwordConfirmationInput = this.chooseMethodFormWrapper.getByTestId(
      dataTestIds.registration.chooseMethodForm.passwordConfirmationInput,
    )
    this.passwordConfirmationInputErrors = getInputErrors(this.passwordConfirmationInput)
    this.passkeyButton = this.chooseMethodFormWrapper.getByTestId(
      dataTestIds.registration.chooseMethodForm.passkeyButton,
    )

    // Email verification form
    this.emailVerificationFormWrapper = page.getByTestId(dataTestIds.registration.emailVerificationForm.wrapper)
    this.emailVerificationCodeInput = this.emailVerificationFormWrapper.getByTestId(
      dataTestIds.registration.emailVerificationForm.codeInput,
    )
    this.emailVerificationSubmitButton = this.emailVerificationFormWrapper.getByTestId(
      dataTestIds.registration.emailVerificationForm.submitButton,
    )
    this.emailVerificationResendButton = this.emailVerificationFormWrapper.getByTestId(
      dataTestIds.registration.emailVerificationForm.resendButton,
    )
  }

  async visit(initialFlowId: null | string = null) {
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
