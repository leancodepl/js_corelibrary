import { expect, test } from "@playwright/test"
import { authenticator } from "otplib"
import { generateEmail, generatePassword, generateUserData, registerUser } from "../../helpers/users"
import { WebAuthnHelper } from "../../helpers/webauthn"
import { IdentityPage } from "../../pageObjects/identity"
import { LoginPage } from "../../pageObjects/login"
import { SettingsPage } from "../../pageObjects/settings"
import {
    runKratosContainer,
    runMailpitContainer,
    stopKratosContainer,
    stopMailpitContainer,
} from "../../services/testcontainers"

test.describe("settings page", () => {
    test.beforeAll(async () => {
        await runMailpitContainer()
        await runKratosContainer()
    })

    test.afterAll(async () => {
        await stopMailpitContainer()
        await stopKratosContainer()
    })

    test.beforeEach(async ({ context }) => {
        await context.clearCookies()
    })

    test("should render all forms if logged in", async ({ page }) => {
        const userData = generateUserData()

        await runKratosContainer({
            verificationFlowEnabled: false,
        })

        await registerUser({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()
        await loginPage.performCompleteLoginFlow(userData.email, userData.password)

        const settingsPage = new SettingsPage(page)
        await settingsPage.visit()

        await expect(settingsPage.wrapper).toBeVisible()
        await expect(settingsPage.traitsFormWrapper).toBeVisible()
        await expect(settingsPage.newPasswordFormWrapper).toBeVisible()
        await expect(settingsPage.passkeysFormWrapper).toBeVisible()
        await expect(settingsPage.oidcFormWrapper).toBeVisible()
        await expect(settingsPage.totpFormUnlinkedWrapper).toBeVisible()
    })

    test.describe("traits form", () => {
        test("should show current traits", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer({
                verificationFlowEnabled: false,
            })

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.traitsFormWrapper).toBeVisible()
            await expect(settingsPage.emailInput).toHaveValue(userData.email)
            await expect(settingsPage.givenNameInput).toHaveValue(userData.firstName)
        })

        test("should update traits", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer({
                verificationFlowEnabled: false,
                settingsPrivilegedSession: "long",
            })

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.traitsFormWrapper).toBeVisible()
            await expect(settingsPage.traitsFormErrors).toBeHidden()

            const newEmail = generateUserData().email
            const newFirstName = "new-first-name"

            await settingsPage.emailInput.fill(newEmail)
            await settingsPage.givenNameInput.fill(newFirstName)
            await settingsPage.clickTraitsFormUpdateButton()

            const updateFlowResponse = await settingsPage.waitForSettingsFlowUpdateResponse()

            expect(updateFlowResponse.status()).toBe(200)

            const identityPage = new IdentityPage(page)
            await identityPage.visit()

            await identityPage.assertEmail(newEmail)
            await identityPage.assertFirstName(newFirstName)
        })

        test("should show errors when traits form is invalid", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer({
                verificationFlowEnabled: false,
            })

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.traitsFormWrapper).toBeVisible()
            await expect(settingsPage.traitsFormErrors).toBeHidden()

            await settingsPage.emailInput.fill("invalid-email")
            await settingsPage.clickTraitsFormUpdateButton()

            await expect(settingsPage.emailInputErrors).toBeVisible()
        })

        test("should require re-authentication for traits update if privileged session expired", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer({
                verificationFlowEnabled: false,
                settingsPrivilegedSession: "short",
            })

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.traitsFormWrapper).toBeVisible()
            await expect(settingsPage.traitsFormErrors).toBeHidden()

            const newEmail = generateUserData().email

            // Ensure privileged session has expired
            await page.waitForTimeout(1000)

            await settingsPage.emailInput.fill(newEmail)
            await settingsPage.clickTraitsFormUpdateButton()

            await expect(page).toHaveURL(/\/login.*/)

            const reAuthLoginPage = new LoginPage(page)

            await expect(reAuthLoginPage.wrapper).toBeVisible()
            await expect(reAuthLoginPage.chooseMethodFormWrapper).toBeVisible()

            await expect(reAuthLoginPage.existingIdentifier).toBeVisible()
            await reAuthLoginPage.fillPassword(userData.password)
            await reAuthLoginPage.clickLogin()

            await expect(page).toHaveURL(/\/settings.*/)

            await expect(settingsPage.traitsFormWrapper).toBeVisible()
            await expect(settingsPage.emailInput).toHaveValue(newEmail)
        })

        test("should inform about email verification requirement on email update", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer({
                verificationFlowEnabled: true,
                settingsPrivilegedSession: "short",
            })

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            const newEmail = generateEmail()

            await settingsPage.emailInput.fill(newEmail)
            await expect(settingsPage.emailVerificationRequiredInfo).toBeHidden()
            await settingsPage.clickTraitsFormUpdateButton()
            await expect(settingsPage.emailVerificationRequiredInfo).toBeVisible()
        })
    })

    test.describe("new password form", () => {
        test("should update password", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer()

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.newPasswordFormWrapper).toBeVisible()
            await expect(settingsPage.newPasswordFormErrors).toBeHidden()

            const newPassword = generatePassword()

            await settingsPage.fillNewPasswordForm(newPassword, newPassword)
            await settingsPage.clickNewPasswordFormSubmitButton()

            const updateFlowResponse = await settingsPage.waitForSettingsFlowUpdateResponse()

            expect(updateFlowResponse.status()).toBe(200)

            await settingsPage.clickLogoutButton()
            await expect(settingsPage.headerNotLoggedIn).toBeVisible()

            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, newPassword)

            const identityPage = new IdentityPage(page)
            await identityPage.assertEmail(userData.email)
        })

        test("should show errors when new password form is invalid", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer()

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.newPasswordFormWrapper).toBeVisible()
            await expect(settingsPage.newPasswordFormErrors).toBeHidden()

            await settingsPage.fillNewPasswordForm("short", "short")
            await settingsPage.clickNewPasswordFormSubmitButton()

            await expect(settingsPage.newPasswordInputErrors).toBeVisible()
        })

        test("should require re-authentication for password update if privileged session expired", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer({
                settingsPrivilegedSession: "short",
            })

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.newPasswordFormWrapper).toBeVisible()
            await expect(settingsPage.newPasswordFormErrors).toBeHidden()

            // Ensure privileged session has expired
            await page.waitForTimeout(1000)

            const newPassword = generateUserData().password

            await settingsPage.fillNewPasswordForm(newPassword, newPassword)
            await settingsPage.clickNewPasswordFormSubmitButton()

            await expect(page).toHaveURL(/\/login.*/)

            const reAuthLoginPage = new LoginPage(page)

            await expect(reAuthLoginPage.wrapper).toBeVisible()
            await expect(reAuthLoginPage.chooseMethodFormWrapper).toBeVisible()

            await expect(reAuthLoginPage.existingIdentifier).toBeVisible()
            await reAuthLoginPage.fillPassword(userData.password)
            await reAuthLoginPage.clickLogin()

            await expect(page).toHaveURL(/\/settings.*/)

            await expect(settingsPage.newPasswordFormWrapper).toBeVisible()
        })
    })

    test.describe("passkeys form", () => {
        test("should add a new passkey", async ({ page, context }) => {
            const userData = generateUserData()
            const webAuthnHelper = new WebAuthnHelper(page, context)
            await webAuthnHelper.setupWebAuthnEnvironment()

            await runKratosContainer()

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.passkeysFormWrapper).toBeVisible()
            await expect(settingsPage.existingPasskeys).toHaveCount(0)

            await settingsPage.clickAddNewPasskeyButton()

            await webAuthnHelper.setUserVerified(true)

            await expect(settingsPage.existingPasskeys).toHaveCount(1)

            await webAuthnHelper.removeAuthenticator()
        })

        test("should remove an existing passkey", async ({ page, context }) => {
            const userData = generateUserData()
            const webAuthnHelper = new WebAuthnHelper(page, context)
            await webAuthnHelper.setupWebAuthnEnvironment()

            await runKratosContainer()

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()
            await settingsPage.clickAddNewPasskeyButton()

            await webAuthnHelper.setUserVerified(true)

            await expect(settingsPage.existingPasskeys).toHaveCount(1)

            await settingsPage.clickRemovePasskeyButton()

            await expect(settingsPage.existingPasskeys).toHaveCount(0)

            await webAuthnHelper.removeAuthenticator()
        })
    })

    test.describe("TOTP form", () => {
        test("should link TOTP", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer()

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.totpFormUnlinkedWrapper).toBeVisible()
            await expect(settingsPage.totpFormLinkedWrapper).toBeHidden()

            const totpCode = authenticator.generate(await settingsPage.getTotpSecretKey())

            await settingsPage.totpCodeInput.fill(totpCode)
            await settingsPage.verifyTotpButton.click()

            const updateFlowResponse = await settingsPage.waitForSettingsFlowUpdateResponse()
            expect(updateFlowResponse.status()).toBe(200)

            await expect(settingsPage.totpFormUnlinkedWrapper).toBeHidden()
            await expect(settingsPage.totpFormLinkedWrapper).toBeVisible()
        })

        test("should unlink TOTP", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer()

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            const totpCode = authenticator.generate(await settingsPage.getTotpSecretKey())

            await settingsPage.totpCodeInput.fill(totpCode)
            await settingsPage.verifyTotpButton.click()

            const updateFlowResponse = await settingsPage.waitForSettingsFlowUpdateResponse()
            expect(updateFlowResponse.status()).toBe(200)

            await expect(settingsPage.totpFormUnlinkedWrapper).toBeHidden()
            await expect(settingsPage.totpFormLinkedWrapper).toBeVisible()

            await settingsPage.unlinkTotpButton.click()

            await expect(settingsPage.totpFormUnlinkedWrapper).toBeVisible()
            await expect(settingsPage.totpFormLinkedWrapper).toBeHidden()
        })

        test("should show error when TOTP code is invalid", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer()

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.totpFormUnlinkedWrapper).toBeVisible()
            await expect(settingsPage.totpFormLinkedWrapper).toBeHidden()

            await settingsPage.totpCodeInput.fill("123456")
            await settingsPage.verifyTotpButton.click()

            const flowUpdateResponse = await settingsPage.waitForSettingsFlowUpdateResponse()
            expect(flowUpdateResponse.status()).toBe(400)

            await expect(settingsPage.totpFormUnlinkedWrapper).toBeVisible()
            await expect(settingsPage.totpFormLinkedWrapper).toBeHidden()
        })
    })

    test.describe("OIDC form", () => {
        test("should show OIDC buttons of configured providers", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer({
                oidcMethodsEnabled: true,
            })

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.oidcFormWrapper).toBeVisible()
            await expect(settingsPage.appleButton).toBeHidden()
            await expect(settingsPage.facebookButton).toBeHidden()
            await expect(settingsPage.googleButton).toBeVisible()
        })

        test("should show link Google OIDC button", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer({
                oidcMethodsEnabled: true,
            })

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await expect(settingsPage.googleButton).toHaveText(/.*\(link\)/)
        })

        test("Google link OIDC should redirect to Google login", async ({ page }) => {
            const userData = generateUserData()

            await runKratosContainer({
                oidcMethodsEnabled: true,
            })

            await registerUser({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
            })

            const loginPage = new LoginPage(page)
            await loginPage.visit()
            await loginPage.performCompleteLoginFlow(userData.email, userData.password)

            const settingsPage = new SettingsPage(page)
            await settingsPage.visit()

            await settingsPage.googleButton.click()

            await expect(page).toHaveURL(/\/accounts\.google\.com\//)
        })
    })
})
