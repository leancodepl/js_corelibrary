import { expect, Page } from "@playwright/test"
import { CommonPage } from "../common"

export class IdentityPage extends CommonPage {
    static readonly route = "/identity"
    readonly wrapper
    readonly email
    readonly firstName

    constructor(protected readonly page: Page) {
        super(page)

        this.wrapper = page.getByTestId("identity-page")
        this.email = page.getByTestId("email")
        this.firstName = page.getByTestId("first-name")
    }

    async visit() {
        await this.page.goto(IdentityPage.route)
    }

    async isVisible() {
        return this.wrapper.isVisible()
    }

    async assertEmail(email: string) {
        return await expect(this.email).toHaveText(email)
    }

    async assertFirstName(firstName: string) {
        return await expect(this.firstName).toHaveText(firstName)
    }
}
