import { expect, test } from "@playwright/test"
import { generateUserData, registerUser } from "../../helpers/users"
import { IdentityPage } from "../../pageObjects/identity"
import { LoginPage } from "../../pageObjects/login"
import { runKratosContainer, runMailpitContainer, stopMailpitContainer } from "../../services/testcontainers"

test.describe("login page", () => {
    test.beforeAll(async () => {
        await runMailpitContainer()
        await runKratosContainer()
    })

    test.afterAll(async () => {
        await stopMailpitContainer()
        await stopMailpitContainer()
    })

    test.beforeEach(async ({ context }) => {
        await context.clearCookies()
    })

    test("user should be able to login with valid email and password", async ({ page }) => {
        const USER_DATA = generateUserData()

        await registerUser({
            email: USER_DATA.email,
            password: USER_DATA.password,
            firstName: USER_DATA.firstName,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()

        await expect(loginPage.wrapper).toBeVisible()
        await expect(loginPage.chooseMethodFormWrapper).toBeVisible()

        await loginPage.fillIdentifier(USER_DATA.email)
        await loginPage.fillPassword(USER_DATA.password)

        await loginPage.clickLogin()

        await page.waitForURL("**/identity*")

        const identityPage = new IdentityPage(page)
        await expect(identityPage.wrapper).toBeVisible()

        await identityPage.assertEmail(USER_DATA.email)
    })

    test("should show error after sending invalid password using valid email", async ({ page }) => {
        const USER_DATA = generateUserData()

        await registerUser({
            email: USER_DATA.email,
            password: USER_DATA.password,
            firstName: USER_DATA.firstName,
            verified: true,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()

        await expect(loginPage.wrapper).toBeVisible()
        await expect(loginPage.chooseMethodFormWrapper).toBeVisible()
        await expect(loginPage.errors).toBeHidden()

        await loginPage.fillIdentifier(USER_DATA.email)
        await loginPage.fillPassword("wrong-password")

        await loginPage.clickLogin()

        await expect(loginPage.errors).toBeVisible()
    })

    test("should show error after sending invalid email and password", async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.visit()

        await expect(loginPage.wrapper).toBeVisible()
        await expect(loginPage.chooseMethodFormWrapper).toBeVisible()
        await expect(loginPage.errors).toBeHidden()

        await loginPage.fillIdentifier("invalid-email")
        await loginPage.fillPassword("any-password")

        await loginPage.clickLogin()

        await expect(loginPage.errors).toBeVisible()
    })

    // test("should be able to login with valid email and passkey after registration", async ({ page, context }) => {
    //     const USER_DATA = generateUserData()

    //     await runKratosContainer({
    //         SELFSERVICE_FLOWS_VERIFICATION_ENABLED: "false",
    //     })

    //     // Create and setup the virtual passkey device
    //     const webAuthnHelper = new WebAuthnHelper(page, context)
    //     await webAuthnHelper.setupWebAuthnEnvironment()

    //     const registrationPage = new RegistrationPage(page)

    //     await registrationPage.visit()
    //     await expect(registrationPage.wrapper).toBeVisible()
    //     await expect(registrationPage.traitsFormWrapper).toBeVisible()

    //     await registrationPage.fillTraitsForm(USER_DATA.email, USER_DATA.firstName, true)
    //     await registrationPage.clickRegisterButton()

    //     await expect(registrationPage.chooseMethodFormWrapper).toBeVisible()
    //     await registrationPage.clickPasskeyButton()
    //     await webAuthnHelper.setUserVerified(true) // Auto-approve the passkey prompt

    //     await page.waitForURL("**/redirect-after-registration")
    //     expect(page.url()).toContain("/redirect-after-registration")

    //     const loginPage = new LoginPage(page)
    //     await loginPage.visit()

    //     await loginPage.clickPasskey()
    //     await webAuthnHelper.setUserVerified(true) // Auto-approve the passkey prompt
    //     await page.waitForURL("**/identity*")
    //     const identityPage = new IdentityPage(page)
    //     await expect(identityPage.wrapper).toBeVisible()
    //     await identityPage.assertEmail(USER_DATA.email)
    // })

    test("should require email verification if active and user email not verified", async ({ page }) => {
        const USER_DATA = generateUserData()

        await runKratosContainer({
            SELFSERVICE_FLOWS_LOGIN_AFTER_PASSWORD_HOOKS_0_HOOK: "verification",
            SELFSERVICE_FLOWS_LOGIN_AFTER_PASSWORD_HOOKS_1_HOOK: "show_verification_ui",
        })

        await registerUser({
            email: USER_DATA.email,
            password: USER_DATA.password,
            firstName: USER_DATA.firstName,
            verified: false,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()

        await expect(loginPage.wrapper).toBeVisible()
        await expect(loginPage.chooseMethodFormWrapper).toBeVisible()

        await loginPage.fillIdentifier(USER_DATA.email)
        await loginPage.fillPassword(USER_DATA.password)

        await loginPage.clickLogin()

        await expect(loginPage.emailVerificationFormWrapper).toBeVisible()
    })

    test("should not require email verification if unset and user email not verified", async ({ page }) => {
        const USER_DATA = generateUserData()

        await runKratosContainer()

        await registerUser({
            email: USER_DATA.email,
            password: USER_DATA.password,
            firstName: USER_DATA.firstName,
            verified: false,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()

        await expect(loginPage.wrapper).toBeVisible()
        await expect(loginPage.chooseMethodFormWrapper).toBeVisible()

        await loginPage.fillIdentifier(USER_DATA.email)
        await loginPage.fillPassword(USER_DATA.password)

        await loginPage.clickLogin()

        await page.waitForURL("**/identity*")

        const identityPage = new IdentityPage(page)
        await expect(identityPage.wrapper).toBeVisible()
    })
})
