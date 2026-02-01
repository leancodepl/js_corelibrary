import { join } from "node:path"
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from "vitest"
import { validateCrossFeatureImports } from "../src/commands/validateCrossFeatureImports"

describe("cross-feature-imports validation", () => {
  let consoleSpy: MockInstance<typeof console.error>

  beforeEach(() => {
    consoleSpy = vi.spyOn(globalThis.console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it("should detect violations in SurveyEditor (nested sibling child import)", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "surveys/SurveyEditor/index.tsx")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    await validateCrossFeatureImports({
      directories: [filePath],
      configPath: configPath,
    })

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("cross-feature-nested-imports"))
  }, 30000)

  it("should detect violations in SnapshotPollEditor (nested sibling child)", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "polls/SnapshotPollEditor/index.tsx")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    await validateCrossFeatureImports({
      directories: [filePath],
      configPath: configPath,
    })

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("cross-feature-nested-imports"))
  }, 30000)

  it("should detect violations in ActivityEditor (nested sibling child import)", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "activities/index.tsx")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    await validateCrossFeatureImports({
      directories: [filePath],
      configPath: configPath,
    })

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("cross-feature-nested-imports"))
  }, 30000)

  it("should allow import from direct sibling index", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "polls/PollEditor/index.tsx")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    await validateCrossFeatureImports({
      directories: [filePath],
      configPath: configPath,
    })

    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining("no-cross-feature-nested-imports"))
  })

  it("should allow import from immediate sibling child file", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "polls/PollEditor/index.tsx")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    await validateCrossFeatureImports({
      directories: [filePath],
      configPath: configPath,
    })

    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining("no-cross-feature-nested-imports"))
  })

  it("should allow import from own child", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "polls/PollEditor/index.tsx")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    await validateCrossFeatureImports({
      directories: [filePath],
      configPath: configPath,
    })

    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining("no-cross-feature-nested-imports"))
  })
})
