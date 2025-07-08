import { expect, test } from "@playwright/test"
import { getVerificationCodeFromEmail } from "../../helpers/mails"
import { generateUserData, registerUser } from "../../helpers/users"
import { WebAuthnHelper } from "../../helpers/webauthn"
import { LoginPage } from "../../pageObjects/login"
import { RegistrationPage } from "../../pageObjects/registration"
import { MailpitHelper } from "../../services/mailpit/MailpitHelper"
import {
    runKratosContainer,
    runMailpitContainer,
    stopKratosContainer,
    stopMailpitContainer,
} from "../../services/testcontainers"

test.describe("register page", () => {
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

    test("user should be able to register with password", async ({ page }) => {
        const USER_DATA = generateUserData()

        const mail = new MailpitHelper(page.request)
        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit()
        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.fillTraitsForm(USER_DATA.email, USER_DATA.firstName, true)
        await registrationPage.clickRegisterButton()

        await expect(registrationPage.chooseMethodFormWrapper).toBeVisible()

        await registrationPage.fillChooseMethodForm(USER_DATA.password, USER_DATA.password)
        await registrationPage.clickRegisterButton()

        const registrationResponse = await registrationPage.waitForRegistrationFlowUpdateResponse()
        expect(registrationResponse.status()).toBe(200)

        const verificationCode = await getVerificationCodeFromEmail(mail, USER_DATA.email)
        expect(verificationCode).not.toBeNull()

        await expect(registrationPage.emailVerificationFormWrapper).toBeVisible()

        await registrationPage.fillEmailVerificationCode(verificationCode)
        await registrationPage.clickEmailVerificationSubmitButton()

        await page.waitForURL("**/redirect-after-registration")
        expect(page.url()).toContain("/redirect-after-registration")
    })

    test("should not show password/passkey form with invalid email", async ({ page }) => {
        const USER_DATA = generateUserData()
        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit()
        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        // Fill traits form with invalid data
        await expect(registrationPage.emailInputErrors).toBeHidden()
        await registrationPage.fillTraitsForm("invalid-email", USER_DATA.firstName, true)
        await registrationPage.clickRegisterButton()

        // Expect to see errors
        await expect(registrationPage.emailInputErrors).toBeVisible()

        // Ensure that the choose method form is not visible
        await expect(registrationPage.chooseMethodFormWrapper).toBeHidden()
    })

    test("should not show password/passkey form without accepting regulations", async ({ page }) => {
        const USER_DATA = generateUserData()
        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit()
        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        // Fill traits form without accepting regulations
        await expect(registrationPage.regulationsCheckboxErrors).toBeHidden()
        await registrationPage.fillTraitsForm(USER_DATA.email, USER_DATA.firstName, false)
        await registrationPage.clickRegisterButton()

        // Expect to see errors
        await expect(registrationPage.regulationsCheckboxErrors).toBeVisible()

        // Ensure that the choose method form is not visible
        await expect(registrationPage.chooseMethodFormWrapper).toBeHidden()
    })

    test("user should be able to go back to traits form", async ({ page }) => {
        const USER_DATA = generateUserData()

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()

        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.fillTraitsForm(USER_DATA.email, USER_DATA.firstName, true)
        await registrationPage.clickRegisterButton()

        await expect(registrationPage.chooseMethodFormWrapper).toBeVisible()
        await registrationPage.clickReturnButton()

        await expect(registrationPage.traitsFormWrapper).toBeVisible()
        await expect(registrationPage.chooseMethodFormWrapper).toBeHidden()
    })

    test("should show error after sending empty password", async ({ page }) => {
        const USER_DATA = generateUserData()
        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit()
        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.fillTraitsForm(USER_DATA.email, USER_DATA.firstName, true)
        await registrationPage.clickRegisterButton()

        await expect(registrationPage.passwordInputErrors).toBeHidden()
        await expect(registrationPage.passwordConfirmationInputErrors).toBeHidden()

        await registrationPage.fillChooseMethodForm("", "")
        await registrationPage.clickRegisterButton()

        // Expect to see errors
        // await expect(registrationPage.passwordInputErrors).toBeHidden()
        await expect(registrationPage.passwordConfirmationInputErrors).toBeVisible()

        await expect(registrationPage.chooseMethodFormWrapper).toBeVisible()
        await expect(registrationPage.emailVerificationFormWrapper).toBeHidden()
    })

    test("should show error with not matching password confirmation", async ({ page }) => {
        const USER_DATA = generateUserData()
        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit()
        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.fillTraitsForm(USER_DATA.email, USER_DATA.firstName, true)
        await registrationPage.clickRegisterButton()

        await expect(registrationPage.passwordInputErrors).toBeHidden()
        await expect(registrationPage.passwordConfirmationInputErrors).toBeHidden()

        await registrationPage.fillChooseMethodForm(USER_DATA.password, "wrongConfirmation")
        await registrationPage.clickRegisterButton()

        // Expect to see errors
        await expect(registrationPage.passwordInputErrors).toBeHidden()
        await expect(registrationPage.passwordConfirmationInputErrors).toBeVisible()

        await expect(registrationPage.chooseMethodFormWrapper).toBeVisible()
        await expect(registrationPage.emailVerificationFormWrapper).toBeHidden()
    })

    test("should resend verification code", async ({ page }) => {
        const USER_DATA = generateUserData()

        const mail = new MailpitHelper(page.request)
        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit()

        await registrationPage.fillTraitsForm(USER_DATA.email, USER_DATA.firstName, true)
        await registrationPage.clickRegisterButton()

        await registrationPage.fillChooseMethodForm(USER_DATA.password, USER_DATA.password)
        await registrationPage.clickRegisterButton()

        await mail.waitForCondition(
            () => mail.getEmailsByTo(USER_DATA.email),
            result => result.messages_count === 1,
        )

        const verificationCode = await getVerificationCodeFromEmail(mail, USER_DATA.email)
        expect(verificationCode).not.toBeNull()

        await registrationPage.clickEmailVerificationResendButton()

        await mail.waitForCondition(
            () => mail.getEmailsByTo(USER_DATA.email),
            result => result.messages_count === 2,
        )

        const secondVerificationCode = await getVerificationCodeFromEmail(mail, USER_DATA.email)
        expect(secondVerificationCode).not.toBeNull()
        expect(secondVerificationCode).not.toEqual(verificationCode)
    })

    test("should be able to register with passkey", async ({ page, context }) => {
        const USER_DATA = generateUserData()

        await runKratosContainer({
            SELFSERVICE_FLOWS_VERIFICATION_ENABLED: "false",
        })

        // Create and setup the virtual passkey device
        const webAuthnHelper = new WebAuthnHelper(page, context)
        await webAuthnHelper.setupWebAuthnEnvironment()

        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit()
        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.fillTraitsForm(USER_DATA.email, USER_DATA.firstName, true)
        await registrationPage.clickRegisterButton()

        await expect(registrationPage.chooseMethodFormWrapper).toBeVisible()
        await registrationPage.clickPasskeyButton()
        await webAuthnHelper.setUserVerified(true) // Auto-approve the passkey prompt

        await page.waitForURL("**/redirect-after-registration")
        expect(page.url()).toContain("/redirect-after-registration")
    })

    test("should redirect to google after clicking sign up with google button", async ({ page }) => {
        // page.on("request", request => console.log(">>", request.method(), request.url()))
        // page.on("response", response => console.log("<<", response.status(), response.url()))

        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit()
        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.clickGoogleButton()

        await page.waitForURL("**/accounts.google.com/**")
        expect(page.url()).toContain("accounts.google.com")
    })

    test("should not show email verification page if not enabled", async ({ page }) => {
        const USER_DATA = generateUserData()

        await runKratosContainer({
            SELFSERVICE_FLOWS_VERIFICATION_ENABLED: "false",
        })

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()

        await registrationPage.fillTraitsForm(USER_DATA.email, USER_DATA.firstName, true)
        await registrationPage.clickRegisterButton()

        await registrationPage.fillChooseMethodForm(USER_DATA.password, USER_DATA.password)
        await registrationPage.clickRegisterButton()

        const registrationResponse = await registrationPage.waitForRegistrationFlowUpdateResponse()
        expect(registrationResponse.status()).toBe(200)

        await page.waitForURL("**/redirect-after-registration")
        expect(page.url()).toContain("/redirect-after-registration")
        await expect(registrationPage.emailVerificationFormWrapper).toBeHidden()
    })

    test("should prevent registration if logged in", async ({ page }) => {
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

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()
        await expect(registrationPage.alreadyLoggedInWrapper).toBeVisible()
        await expect(registrationPage.wrapper).toBeHidden()
    })

    test("should try use initial flow id", async ({ page }) => {
        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit()

        const createFlowResponse = await registrationPage.waitForRegistrationFlowCreateResponse()
        const flow = await createFlowResponse.json()
        expect(typeof flow.id).toBe("string")

        await registrationPage.visit(flow.id)

        const getFlowResponse = await registrationPage.waitForRegistrationFlowGetResponse(flow.id)
        expect(getFlowResponse.status()).toBe(200)

        await expect(registrationPage.wrapper).toBeVisible()
    })

    test("should create new flow id if initial flow id is invalid", async ({ page }) => {
        const FLOW_ID = "invalid-flow-id"
        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit(FLOW_ID)

        const getFlowResponse = await registrationPage.waitForRegistrationFlowGetResponse(FLOW_ID)
        expect(getFlowResponse.status()).toBe(404)

        const createFlowResponse = await registrationPage.waitForRegistrationFlowCreateResponse()
        expect(createFlowResponse.status()).toBe(200)

        await expect(registrationPage.wrapper).toBeVisible()
    })
})
