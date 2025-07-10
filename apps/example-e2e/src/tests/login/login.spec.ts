import { expect, test } from "@playwright/test"
import { authenticator } from "otplib"
import { generateUserData, registerUser } from "../../helpers/users"
import { IdentityPage } from "../../pageObjects/identity"
import { LoginPage } from "../../pageObjects/login"
import { SettingsPage } from "../../pageObjects/settings"
import {
    runKratosContainer,
    runMailpitContainer,
    stopKratosContainer,
    stopMailpitContainer,
} from "../../services/testcontainers"

test.describe("login page", () => {
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

    test("user should be able to login with valid email and password", async ({ page }) => {
        const userData = generateUserData()

        await registerUser({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()

        await expect(loginPage.wrapper).toBeVisible()
        await expect(loginPage.chooseMethodFormWrapper).toBeVisible()

        await loginPage.fillPasswordForm(userData.email, userData.password)
        await loginPage.clickLogin()
        await expect(page).toHaveURL(/\/identity.*/)

        const identityPage = new IdentityPage(page)
        await expect(identityPage.wrapper).toBeVisible()

        await identityPage.assertEmail(userData.email)
    })

    test("should show error after sending invalid password using valid email", async ({ page }) => {
        const userData = generateUserData()

        await registerUser({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            verified: true,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()

        await expect(loginPage.wrapper).toBeVisible()
        await expect(loginPage.chooseMethodFormWrapper).toBeVisible()
        await expect(loginPage.errors).toBeHidden()

        await loginPage.fillPasswordForm(userData.email, "wrong-password")
        await loginPage.clickLogin()

        await expect(loginPage.errors).toBeVisible()
    })

    test("should show error after sending invalid email and password", async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.visit()

        await expect(loginPage.wrapper).toBeVisible()
        await expect(loginPage.chooseMethodFormWrapper).toBeVisible()
        await expect(loginPage.errors).toBeHidden()

        await loginPage.fillPasswordForm("invalid-email", "any-password")
        await loginPage.clickLogin()

        await expect(loginPage.errors).toBeVisible()
    })

    test("should require email verification if active and user email not verified", async ({ page }) => {
        const userData = generateUserData()

        await runKratosContainer({
            requireVerificationOnLogin: true,
        })

        await registerUser({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            verified: false,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()
        await loginPage.fillPasswordForm(userData.email, userData.password)
        await loginPage.clickLogin()

        await expect(loginPage.emailVerificationFormWrapper).toBeVisible()
    })

    test("should not require email verification if unset and user email not verified", async ({ page }) => {
        const userData = generateUserData()

        await runKratosContainer()

        await registerUser({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            verified: false,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()

        await loginPage.performCompleteLoginFlow(userData.email, userData.password)

        const identityPage = new IdentityPage(page)
        await expect(identityPage.wrapper).toBeVisible()
    })

    test("should require 2FA if TOTP is linked", async ({ page }) => {
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

        const totpSecretKey = await settingsPage.totpSecretKey.textContent()
        const totpCode = authenticator.generate(totpSecretKey)

        await settingsPage.totpCodeInput.fill(totpCode)
        await settingsPage.verifyTotpButton.click()

        const updateFlowResponse = await settingsPage.waitForSettingsFlowUpdateResponse()
        expect(updateFlowResponse.status()).toBe(200)

        await settingsPage.clickLogoutButton()
        await expect(settingsPage.headerNotLoggedIn).toBeVisible()

        await loginPage.visit()
        await loginPage.fillPasswordForm(userData.email, userData.password)
        await loginPage.clickLogin()

        await expect(loginPage.secondFactorFormWrapper).toBeVisible()
        const totpLoginCode = authenticator.generate(totpSecretKey)
        await loginPage.fillTotpInput(totpLoginCode)
        await loginPage.clickLogin()

        await expect(page).toHaveURL(/\/identity.*/)
        const identityPage = new IdentityPage(page)
        await expect(identityPage.wrapper).toBeVisible()
        await identityPage.assertEmail(userData.email)
    })
})
