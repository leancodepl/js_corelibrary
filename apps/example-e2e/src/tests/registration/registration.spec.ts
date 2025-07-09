import { expect, test } from "@playwright/test"
import { get6DigitCodeFromEmail } from "../../helpers/mails"
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
        const userData = generateUserData()

        const mail = new MailpitHelper()

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()

        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.fillTraitsForm(userData.email, userData.firstName, true)
        await registrationPage.clickRegisterButton()

        await expect(registrationPage.chooseMethodFormWrapper).toBeVisible()

        await registrationPage.fillChooseMethodForm(userData.password, userData.password)
        await registrationPage.clickRegisterButton()

        const registrationResponse = await registrationPage.waitForRegistrationFlowUpdateResponse()
        expect(registrationResponse.status()).toBe(200)

        const verificationCode = await get6DigitCodeFromEmail(mail, userData.email)
        expect(verificationCode).not.toBeNull()

        await expect(registrationPage.emailVerificationFormWrapper).toBeVisible()

        await registrationPage.fillEmailVerificationCode(verificationCode)
        await registrationPage.clickEmailVerificationSubmitButton()

        await expect(page).toHaveURL(/\/redirect-after-registration$/)
    })

    test("should not show password/passkey form with invalid email", async ({ page }) => {
        const userData = generateUserData()

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()

        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        // Fill traits form with invalid data
        await expect(registrationPage.emailInputErrors).toBeHidden()
        await registrationPage.fillTraitsForm("invalid-email", userData.firstName, true)
        await registrationPage.clickRegisterButton()

        // Expect to see errors
        await expect(registrationPage.emailInputErrors).toBeVisible()

        // Ensure that the choose method form is not visible
        await expect(registrationPage.chooseMethodFormWrapper).toBeHidden()
    })

    test("should not show password/passkey form without accepting regulations", async ({ page }) => {
        const userData = generateUserData()

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()

        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        // Fill traits form without accepting regulations
        await expect(registrationPage.regulationsCheckboxErrors).toBeHidden()
        await registrationPage.fillTraitsForm(userData.email, userData.firstName, false)
        await registrationPage.clickRegisterButton()

        // Expect to see errors
        await expect(registrationPage.regulationsCheckboxErrors).toBeVisible()

        // Ensure that the choose method form is not visible
        await expect(registrationPage.chooseMethodFormWrapper).toBeHidden()
    })

    test("user should be able to go back to traits form", async ({ page }) => {
        const userData = generateUserData()

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()

        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.fillTraitsForm(userData.email, userData.firstName, true)
        await registrationPage.clickRegisterButton()

        await expect(registrationPage.chooseMethodFormWrapper).toBeVisible()
        await registrationPage.clickReturnButton()

        await expect(registrationPage.traitsFormWrapper).toBeVisible()
        await expect(registrationPage.chooseMethodFormWrapper).toBeHidden()
    })

    test("should show error after sending empty password", async ({ page }) => {
        const userData = generateUserData()

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()

        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.fillTraitsForm(userData.email, userData.firstName, true)
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
        const userData = generateUserData()

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()

        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.fillTraitsForm(userData.email, userData.firstName, true)
        await registrationPage.clickRegisterButton()

        await expect(registrationPage.passwordInputErrors).toBeHidden()
        await expect(registrationPage.passwordConfirmationInputErrors).toBeHidden()

        await registrationPage.fillChooseMethodForm(userData.password, "wrongConfirmation")
        await registrationPage.clickRegisterButton()

        // Expect to see errors
        await expect(registrationPage.passwordInputErrors).toBeHidden()
        await expect(registrationPage.passwordConfirmationInputErrors).toBeVisible()

        await expect(registrationPage.chooseMethodFormWrapper).toBeVisible()
        await expect(registrationPage.emailVerificationFormWrapper).toBeHidden()
    })

    test("should resend verification code", async ({ page }) => {
        const userData = generateUserData()

        const mail = new MailpitHelper()

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()

        await registrationPage.fillTraitsForm(userData.email, userData.firstName, true)
        await registrationPage.clickRegisterButton()

        await registrationPage.fillChooseMethodForm(userData.password, userData.password)
        await registrationPage.clickRegisterButton()

        await mail.waitForCondition(
            () => mail.getEmailsByTo(userData.email),
            result => result.messages_count === 1,
        )

        const verificationCode = await get6DigitCodeFromEmail(mail, userData.email)
        expect(verificationCode).not.toBeNull()

        await registrationPage.clickEmailVerificationResendButton()

        await mail.waitForCondition(
            () => mail.getEmailsByTo(userData.email),
            result => result.messages_count === 2,
        )

        const secondVerificationCode = await get6DigitCodeFromEmail(mail, userData.email)
        expect(secondVerificationCode).not.toBeNull()
        expect(secondVerificationCode).not.toEqual(verificationCode)
    })

    test("should be able to register with passkey", async ({ page, context }) => {
        const userData = generateUserData()

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

        await registrationPage.fillTraitsForm(userData.email, userData.firstName, true)
        await registrationPage.clickRegisterButton()

        await expect(registrationPage.chooseMethodFormWrapper).toBeVisible()
        await registrationPage.clickPasskeyButton()
        await webAuthnHelper.setUserVerified(true) // Auto-approve the passkey prompt

        await expect(page).toHaveURL(/\/redirect-after-registration$/)

        await webAuthnHelper.removeAuthenticator()
    })

    test("should redirect to google after clicking sign up with google button", async ({ page }) => {
        const registrationPage = new RegistrationPage(page)

        await registrationPage.visit()
        await expect(registrationPage.wrapper).toBeVisible()
        await expect(registrationPage.traitsFormWrapper).toBeVisible()

        await registrationPage.clickGoogleButton()

        await expect(page).toHaveURL(/\/accounts\.google\.com\//)
    })

    test("should not show email verification page if not enabled", async ({ page }) => {
        const userData = generateUserData()

        await runKratosContainer({
            SELFSERVICE_FLOWS_VERIFICATION_ENABLED: "false",
        })

        const registrationPage = new RegistrationPage(page)
        await registrationPage.visit()

        await registrationPage.fillTraitsForm(userData.email, userData.firstName, true)
        await registrationPage.clickRegisterButton()

        await registrationPage.fillChooseMethodForm(userData.password, userData.password)
        await registrationPage.clickRegisterButton()

        const registrationResponse = await registrationPage.waitForRegistrationFlowUpdateResponse()
        expect(registrationResponse.status()).toBe(200)

        await expect(page).toHaveURL(/\/redirect-after-registration$/)
        await expect(registrationPage.emailVerificationFormWrapper).toBeHidden()
    })

    test("should prevent registration if logged in", async ({ page }) => {
        const userData = generateUserData()

        await runKratosContainer({
            SELFSERVICE_FLOWS_VERIFICATION_ENABLED: "false",
        })

        await registerUser({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
        })

        const loginPage = new LoginPage(page)
        await loginPage.visit()
        await loginPage.performCompleteLoginFlow(userData.email, userData.password)

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
