import { Page } from "@playwright/test"

export class CommonPage {
    readonly header
    readonly logoutButton

    readonly headerLoading
    readonly headerNotLoggedIn
    readonly headerLoggedIn

    constructor(protected readonly page: Page) {
        this.header = page.getByTestId("header")
        this.logoutButton = page.getByTestId("logout-button")

        this.headerLoading = page.getByTestId("header-loading")
        this.headerNotLoggedIn = page.getByTestId("header-not-logged-in")
        this.headerLoggedIn = page.getByTestId("header-logged-in")
    }

    async clickLogoutButton() {
        await this.logoutButton.click()
    }
}
