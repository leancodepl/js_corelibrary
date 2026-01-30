/* eslint-disable import/no-extraneous-dependencies */
import { join } from "node:path"
import { type MockInstance, vi } from "vitest"
import { validateSharedComponent } from "../src/commands/validateSharedComponent"

describe("shared-components validation", () => {
  let consoleSpy: MockInstance<typeof console.info>

  beforeEach(() => {
    consoleSpy = vi.spyOn(globalThis.console, "info").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
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

    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining("not-shared-level"))
  })

  it("should flag shared components to be moved", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    await validateSharedComponent({
      directories: [testDir],
      configPath: configPath,
    })

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("not-shared-level"))
  })
})
