import { expect, Locator, Page } from "@playwright/test"

export class IdentityPage {
    static readonly route = "/identity"
    readonly wrapper: Locator
    readonly email: Locator
    readonly firstName: Locator

    constructor(protected readonly page: Page) {
        this.wrapper = page.getByTestId("identity-page")
        this.email = page.getByTestId("email")
        this.firstName = page.getByTestId("first-name")
    }

    async visit() {
        await this.page.goto(IdentityPage.route)
    }

    async isVisible(): Promise<boolean> {
        return this.wrapper.isVisible()
    }

    async assertEmail(email: string) {
        return await expect(this.email).toHaveText(email)
    }

    async assertFirstName(firstName: string) {
        return await expect(this.firstName).toHaveText(firstName)
    }
}
