import { Locator } from "@playwright/test"

export const getInputErrors = (input: Locator) => input.locator('~div[data-testid="input-errors"]')

export const getCheckboxErrors = (checkbox: Locator) =>
    checkbox.locator('xpath=ancestor::div[1]//div[@data-testid="checkbox-errors"]')
