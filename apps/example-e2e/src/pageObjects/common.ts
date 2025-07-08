import { Locator, Page } from "@playwright/test"

export class CommonPage {
    readonly header: Locator
    readonly logoutButton: Locator

    readonly headerLoading: Locator
    readonly headerNotLoggedIn: Locator
    readonly headerLoggedIn: Locator

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
