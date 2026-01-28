import { join } from "node:path"
import { upload } from "../src"
import { getTranslationsServiceClient } from "./_utils"

describe("upload command", () => {
  it("should run upload command with real POEditor credentials if provided", async () => {
    const translationsServiceClient = getTranslationsServiceClient()

    if (!translationsServiceClient) {
      return
    }

    await upload({
      srcPattern: join(__dirname, "testProject/src/**/*.{ts,tsx}"),
      translationsServiceClient,
      defaultLanguage: "en",
    })
  }, 30_000)
})
