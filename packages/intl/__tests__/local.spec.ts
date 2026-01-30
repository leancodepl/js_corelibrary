import { join } from "node:path"
import { local } from "../src"
import { getTranslationsServiceClient } from "./_utils"

describe("local command", () => {
  it("should run local command with real POEditor credentials if provided", async () => {
    const translationsServiceClient = getTranslationsServiceClient()

    if (!translationsServiceClient) {
      return
    }

    await local({
      srcPattern: join(__dirname, "testProject/src/**/*.{ts,tsx}"),
      outputDir: join(__dirname, "testProject/lang"),
      defaultLanguage: "pl",
      translationsServiceClient,
    })
  }, 30000)
})
