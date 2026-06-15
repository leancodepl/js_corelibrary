import { join } from "node:path"
import { MockInstance } from "vitest"
import { validateNoOrphans } from "../src/commands/validateNoOrphans"

describe("validate-no-orphans command", () => {
  let consoleErrorSpy: MockInstance<typeof console.error>
  let consoleInfoSpy: MockInstance<typeof console.info>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(globalThis.console, "error").mockImplementation(() => {})
    consoleInfoSpy = vi.spyOn(globalThis.console, "info").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    consoleInfoSpy.mockRestore()
  })

  it("should flag orphaned files", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "surveys/orphan.ts")

    const violationsCount = await validateNoOrphans({
      directories: [filePath],
    })

    expect(violationsCount).toBeGreaterThan(0)
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.anything(), expect.stringContaining("no-orphans"))
  }, 30000)

  it("should not flag files that are not orphans", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "polls/PollEditor/index.tsx")

    const violationsCount = await validateNoOrphans({
      directories: [filePath],
    })

    expect(violationsCount).toBe(0)
  }, 30000)

  it("should not flag orphans matched by the command's ignore patterns", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "surveys/orphan.ts")
    const configPath = join(dirname, "ignore-orphan.config.json")

    const violationsCount = await validateNoOrphans({
      directories: [filePath],
      configPath,
    })

    expect(violationsCount).toBe(0)
  }, 30000)
})
