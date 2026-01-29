import { dataTestIds } from "@example/e2e-ids"
import { Page } from "@playwright/test"
import { getInputErrors } from "../../helpers/locators"
import { CommonPage } from "../common"

export class SettingsPage extends CommonPage {
  static readonly route = "/settings"
  readonly wrapper

  // Traits form
  readonly traitsFormWrapper
  readonly emailVerificationRequiredInfo
  readonly emailInput
  readonly emailInputErrors
  readonly givenNameInput
  readonly givenNameInputErrors
  readonly traitsFormUpdateButton
  readonly traitsFormErrors

  // New password form
  readonly newPasswordFormWrapper
  readonly newPasswordInput
  readonly newPasswordInputErrors
  readonly newPasswordConfirmationInput
  readonly newPasswordConfirmationInputErrors
  readonly newPasswordFormSubmitButton
  readonly newPasswordFormErrors

  // Passkeys form
  readonly passkeysFormWrapper
  readonly addNewPasskeyButton
  readonly existingPasskeys
  readonly removePasskeyButton

  // TOTP form
  readonly totpFormLinkedWrapper
  readonly totpFormUnlinkedWrapper
  readonly totpSecretKey
  readonly totpCodeInput
  readonly totpCodeInputErrors
  readonly verifyTotpButton
  readonly unlinkTotpButton
  readonly totpFormErrors

  // OIDC form
  readonly oidcFormWrapper
  readonly appleButton
  readonly facebookButton
  readonly googleButton

  constructor(protected readonly page: Page) {
    super(page)

    this.wrapper = page.getByTestId(dataTestIds.settings.page)

    // Traits form
    this.traitsFormWrapper = page.getByTestId(dataTestIds.settings.traitsForm.wrapper)
    this.emailVerificationRequiredInfo = this.traitsFormWrapper.getByTestId(
      dataTestIds.settings.traitsForm.emailVerificationRequiredInfo,
    )
    this.emailInput = this.traitsFormWrapper.getByTestId(dataTestIds.settings.traitsForm.emailInput)
    this.emailInputErrors = getInputErrors(this.emailInput)
    this.givenNameInput = this.traitsFormWrapper.getByTestId(dataTestIds.settings.traitsForm.givenNameInput)
    this.givenNameInputErrors = getInputErrors(this.givenNameInput)
    this.traitsFormUpdateButton = this.traitsFormWrapper.getByTestId(dataTestIds.settings.traitsForm.updateButton)
    this.traitsFormErrors = this.traitsFormWrapper.getByTestId(dataTestIds.settings.traitsForm.errors)

    // New password form
    this.newPasswordFormWrapper = page.getByTestId(dataTestIds.settings.newPasswordForm.wrapper)
    this.newPasswordInput = this.newPasswordFormWrapper.getByTestId(dataTestIds.settings.newPasswordForm.passwordInput)
    this.newPasswordInputErrors = getInputErrors(this.newPasswordInput)
    this.newPasswordConfirmationInput = this.newPasswordFormWrapper.getByTestId(
      dataTestIds.settings.newPasswordForm.passwordConfirmationInput,
    )
    this.newPasswordConfirmationInputErrors = getInputErrors(this.newPasswordConfirmationInput)
    this.newPasswordFormSubmitButton = this.newPasswordFormWrapper.getByTestId(
      dataTestIds.settings.newPasswordForm.submitButton,
    )
    this.newPasswordFormErrors = this.newPasswordFormWrapper.getByTestId(dataTestIds.settings.newPasswordForm.errors)

    // Passkeys form
    this.passkeysFormWrapper = page.getByTestId(dataTestIds.settings.passkeysForm.wrapper)
    this.addNewPasskeyButton = this.passkeysFormWrapper.getByTestId(dataTestIds.settings.passkeysForm.addNewButton)
    this.existingPasskeys = this.passkeysFormWrapper.getByTestId(dataTestIds.settings.passkeysForm.existingPasskey)
    this.removePasskeyButton = this.passkeysFormWrapper.getByTestId(dataTestIds.settings.passkeysForm.removeButton)

    // TOTP form
    this.totpFormLinkedWrapper = page.getByTestId(dataTestIds.settings.totpForm.wrapperLinked)
    this.totpFormUnlinkedWrapper = page.getByTestId(dataTestIds.settings.totpForm.wrapperUnlinked)
    this.totpSecretKey = this.totpFormUnlinkedWrapper.getByTestId(dataTestIds.settings.totpForm.secretKey)
    this.totpCodeInput = this.totpFormUnlinkedWrapper.getByTestId(dataTestIds.settings.totpForm.codeInput)
    this.totpCodeInputErrors = getInputErrors(this.totpCodeInput)
    this.verifyTotpButton = this.totpFormUnlinkedWrapper.getByTestId(dataTestIds.settings.totpForm.verifyButton)
    this.unlinkTotpButton = this.totpFormLinkedWrapper.getByTestId(dataTestIds.settings.totpForm.unlinkButton)
    this.totpFormErrors = this.totpFormUnlinkedWrapper.getByTestId(dataTestIds.settings.totpForm.errors)

    // OIDC form
    this.oidcFormWrapper = page.getByTestId(dataTestIds.settings.oidcForm.wrapper)
    this.appleButton = this.oidcFormWrapper.getByTestId(dataTestIds.settings.oidcForm.appleButton)
    this.facebookButton = this.oidcFormWrapper.getByTestId(dataTestIds.settings.oidcForm.facebookButton)
    this.googleButton = this.oidcFormWrapper.getByTestId(dataTestIds.settings.oidcForm.googleButton)
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
    return this.page.waitForResponse(response => response.url().includes(`/self-service/settings?flow=${flowId ?? ""}`))
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

  async getTraitsFormErrors() {
    const errors = await this.traitsFormErrors.allTextContents()
    return errors.filter(text => text.trim() !== "")
  }

  // New password form

  async fillNewPasswordForm(password: string, confirmation: string) {
    await this.newPasswordInput.fill(password)
    await this.newPasswordConfirmationInput.fill(confirmation)
  }

  async clickNewPasswordFormSubmitButton() {
    await this.newPasswordFormSubmitButton.click()
  }

  async getNewPasswordFormErrors() {
    const errors = await this.newPasswordFormErrors.allTextContents()
    return errors.filter(text => text.trim() !== "")
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

  async getTotpSecretKey() {
    return (await this.totpSecretKey.textContent()) ?? ""
  }

  async getTotpFormErrors() {
    const errors = await this.totpFormErrors.allTextContents()
    return errors.filter(text => text.trim() !== "")
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
