import { join } from "node:path"
import { MockInstance } from "vitest"
import { validateSharedComponent } from "../src/commands/validateSharedComponent"

describe("shared-components validation", () => {
  let consoleErrorSpy: MockInstance<typeof console.error>
  let consoleInfoSpy: MockInstance<typeof console.info>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(globalThis.console, "error").mockImplementation(() => {})
    consoleInfoSpy = vi.spyOn(globalThis.console, "info").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleInfoSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it("should not flag a components as shared to be moved", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "surveys/SurveyEditor/index.tsx")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    await validateSharedComponent({
      directories: [filePath],
      configPath: configPath,
    })

    expect(consoleInfoSpy).not.toHaveBeenCalledWith(expect.anything(), expect.stringContaining("not-shared-level"))
  })

  it("should flag shared components to be moved", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    await validateSharedComponent({
      directories: [testDir],
      configPath: configPath,
    })

    expect(consoleInfoSpy).toHaveBeenCalledWith(expect.anything(), expect.stringContaining("not-shared-level"))
  })
})
