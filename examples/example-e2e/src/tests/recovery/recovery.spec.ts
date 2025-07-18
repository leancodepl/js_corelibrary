import { expect, test } from "@playwright/test"
import { get6DigitCodeFromEmail } from "../../helpers/mails"
import { generatePassword, generateUserData, registerUser } from "../../helpers/users"
import { IdentityPage } from "../../pageObjects/identity"
import { LoginPage } from "../../pageObjects/login"
import { RecoveryPage } from "../../pageObjects/recovery"
import { MailpitHelper } from "../../services/mailpit/MailpitHelper"
import { runKratosContainer, runMailpitContainer } from "../../services/testcontainers"

test.describe("recovery page", () => {
    test.beforeAll(async () => {
        await runMailpitContainer()
        await runKratosContainer()
    })

    test.afterAll(async () => {
        await runMailpitContainer()
        await runKratosContainer()
    })

    test.beforeEach(async ({ context }) => {
        await context.clearCookies()
    })

    test("user should be able to recover account using email and code and then login with new password", async ({
        page,
    }) => {
        const userData = generateUserData()
        const newPassword = generatePassword()

        const mail = new MailpitHelper()

        await registerUser({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
        })

        const recoveryPage = new RecoveryPage(page)
        await recoveryPage.visit()

        await expect(recoveryPage.wrapper).toBeVisible()
        await expect(recoveryPage.emailFormWrapper).toBeVisible()
        await expect(recoveryPage.codeFormWrapper).toBeHidden()
        await expect(recoveryPage.newPasswordFormWrapper).toBeHidden()

        await recoveryPage.fillEmail(userData.email)
        await recoveryPage.clickEmailSubmitButton()

        await expect(recoveryPage.emailFormWrapper).toBeHidden()
        await expect(recoveryPage.codeFormWrapper).toBeVisible()

        const verificationCode = await get6DigitCodeFromEmail(mail, userData.email)
        expect(verificationCode).not.toBeNull()

        await recoveryPage.fillCode(verificationCode)
        await recoveryPage.clickCodeSubmitButton()

        await expect(recoveryPage.codeFormWrapper).toBeHidden()
        await expect(recoveryPage.newPasswordFormWrapper).toBeVisible()

        await recoveryPage.fillNewPassword(newPassword, newPassword)
        await recoveryPage.clickNewPasswordSubmitButton()

        await expect(page).toHaveURL(/\/redirect-after-recovery.*/)

        await recoveryPage.clickLogoutButton()
        await expect(recoveryPage.headerNotLoggedIn).toBeVisible()

        const loginPage = new LoginPage(page)
        await loginPage.visit()
        await loginPage.performCompleteLoginFlow(userData.email, newPassword)

        await expect(page).toHaveURL(/\/identity.*/)

        const identityPage = new IdentityPage(page)
        await expect(identityPage.wrapper).toBeVisible()
        await identityPage.assertEmail(userData.email)
    })

    test("should show error after sending invalid code", async ({ page }) => {
        const userData = generateUserData()

        await registerUser({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
        })

        const recoveryPage = new RecoveryPage(page)
        await recoveryPage.visit()

        await expect(recoveryPage.wrapper).toBeVisible()
        await expect(recoveryPage.emailFormWrapper).toBeVisible()
        await expect(recoveryPage.codeFormWrapper).toBeHidden()
        await expect(recoveryPage.newPasswordFormWrapper).toBeHidden()

        await recoveryPage.fillEmail(userData.email)
        await recoveryPage.clickEmailSubmitButton()

        await expect(recoveryPage.emailFormWrapper).toBeHidden()
        await expect(recoveryPage.codeFormWrapper).toBeVisible()
        await expect(recoveryPage.codeFormErrors).toBeHidden()

        await recoveryPage.fillCode("123456")
        await recoveryPage.clickCodeSubmitButton()

        await expect(recoveryPage.codeFormErrors).toBeVisible()
    })
})
