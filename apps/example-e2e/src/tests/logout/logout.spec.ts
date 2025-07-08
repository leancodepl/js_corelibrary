import { expect, test } from "@playwright/test"
import { generateUserData, registerUser } from "../../helpers/users"
import { IdentityPage } from "../../pageObjects/identity"
import { LoginPage } from "../../pageObjects/login"
import {
    runKratosContainer,
    runMailpitContainer,
    stopKratosContainer,
    stopMailpitContainer,
} from "../../services/testcontainers"

test.describe("logging out", () => {
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

    test("should log out the user", async ({ page }) => {
        const USER_DATA = generateUserData()

        await runKratosContainer({
            SELFSERVICE_FLOWS_VERIFICATION_ENABLED: "false",
        })

        await registerUser({
            email: USER_DATA.email,
            password: USER_DATA.password,
            firstName: USER_DATA.firstName,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()
        await loginPage.fillIdentifier(USER_DATA.email)
        await loginPage.fillPassword(USER_DATA.password)
        await loginPage.clickLogin()
        await page.waitForURL("**/identity*")

        const identityPage = new IdentityPage(page)
        await expect(identityPage.headerLoggedIn).toBeVisible()
        await expect(identityPage.headerNotLoggedIn).toBeHidden()

        await identityPage.clickLogoutButton()

        await expect(identityPage.headerNotLoggedIn).toBeVisible()
        await expect(identityPage.headerLoggedIn).toBeHidden()

        await page.reload()

        await expect(identityPage.headerNotLoggedIn).toBeVisible()
        await expect(identityPage.headerLoggedIn).toBeHidden()
    })
})
