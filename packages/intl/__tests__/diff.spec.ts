import { join } from "node:path"
import { diff } from "../src"
import { getTranslationsServiceClient } from "./_utils"

describe("diff command", () => {
  it("should run diff command with real POEditor credentials if provided", async () => {
    const translationsServiceClient = getTranslationsServiceClient()

    if (!translationsServiceClient) {
      return
    }

    await diff({
      srcPattern: join(__dirname, "testProject/src/**/*.{ts,tsx}"),
      translationsServiceClient,
    })
  }, 30_000)
})
