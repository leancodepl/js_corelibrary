import { join } from "node:path"
import { download } from "../src"
import { getTranslationsServiceClient } from "./_utils"

describe("download command", () => {
  it("should run download command with real POEditor credentials if provided", async () => {
    const translationsServiceClient = getTranslationsServiceClient()

    if (!translationsServiceClient) {
      return
    }

    await download({
      outputDir: join(__dirname, "testProject/lang"),
      languages: ["en", "pl"],
      translationsServiceClient,
    })
  }, 30000)
})
