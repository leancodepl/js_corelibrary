import { dataTestIds } from "@example/e2e-ids"
import { expect, Page } from "@playwright/test"
import { CommonPage } from "../common"

export class IdentityPage extends CommonPage {
  static readonly route = "/identity"
  readonly wrapper
  readonly email
  readonly firstName

  constructor(protected readonly page: Page) {
    super(page)

    this.wrapper = page.getByTestId(dataTestIds.identity.page)
    this.email = page.getByTestId(dataTestIds.identity.email)
    this.firstName = page.getByTestId(dataTestIds.identity.firstName)
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
