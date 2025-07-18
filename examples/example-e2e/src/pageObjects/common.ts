import { dataTestIds } from "@example/e2e-ids"
import { Page } from "@playwright/test"

export class CommonPage {
    readonly header
    readonly logoutButton

    readonly headerLoading
    readonly headerNotLoggedIn
    readonly headerLoggedIn

    constructor(protected readonly page: Page) {
        this.header = page.getByTestId(dataTestIds.userInfoHeader.header)
        this.logoutButton = page.getByTestId(dataTestIds.userInfoHeader.logoutButton)

        this.headerLoading = page.getByTestId(dataTestIds.userInfoHeader.headerLoading)
        this.headerNotLoggedIn = page.getByTestId(dataTestIds.userInfoHeader.headerNotLoggedIn)
        this.headerLoggedIn = page.getByTestId(dataTestIds.userInfoHeader.headerLoggedIn)
    }

    async clickLogoutButton() {
        await this.logoutButton.click()
    }
}
