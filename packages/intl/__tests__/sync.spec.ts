import { join } from "node:path"
import { sync } from "../src"
import { getTranslationsServiceClient } from "./_utils"

describe("sync command", () => {
  it("should run sync command with real POEditor credentials if provided", async () => {
    const translationsServiceClient = getTranslationsServiceClient()

    if (!translationsServiceClient) {
      return
    }

    await sync({
      srcPattern: join(__dirname, "testProject/src/**/*.{ts,tsx}"),
      outputDir: join(__dirname, "testProject/lang"),
      languages: ["en", "pl"],
      translationsServiceClient,
      defaultLanguage: "pl",
    })
  }, 30000)
})
