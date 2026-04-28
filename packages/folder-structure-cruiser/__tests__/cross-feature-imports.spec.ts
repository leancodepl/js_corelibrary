import { join } from "node:path"
import { MockInstance } from "vitest"
import { validateCrossFeatureImports } from "../src/commands/validateCrossFeatureImports"

describe("cross-feature-imports validation", () => {
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

  async function expectNoCrossFeatureViolations(filePath: string) {
    const dirname = import.meta.dirname
    const configPath = join(dirname, "../src/.dependency-cruiser.json")
    const violationsCount = await validateCrossFeatureImports({
      directories: [filePath],
      configPath,
    })

    expect(violationsCount).toBe(0)
  }

  it("should detect violations in SurveyEditor (nested sibling child import)", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "surveys/SurveyEditor/index.tsx")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    const violationsCount = await validateCrossFeatureImports({
      directories: [filePath],
      configPath: configPath,
    })

    expect(violationsCount).toBeGreaterThan(0)

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("cross-feature-nested-imports"),
    )
  }, 30000)

  it("should detect violations in SnapshotPollEditor (nested sibling child)", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "polls/SnapshotPollEditor/index.tsx")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    const violationsCount = await validateCrossFeatureImports({
      directories: [filePath],
      configPath: configPath,
    })

    expect(violationsCount).toBeGreaterThan(0)

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("cross-feature-nested-imports"),
    )
  }, 30000)

  it("should detect violations in ActivityEditor (nested sibling child import)", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "activities/index.tsx")
    const configPath = join(dirname, "../src/.dependency-cruiser.json")

    const violationsCount = await validateCrossFeatureImports({
      directories: [filePath],
      configPath: configPath,
    })

    expect(violationsCount).toBeGreaterThan(0)

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("cross-feature-nested-imports"),
    )
  }, 30000)

  it("should allow import from direct sibling index", async () => {
    const dirname = import.meta.dirname
    const filePath = join(dirname, "test-structure/wizards/index.tsx")

    await expectNoCrossFeatureViolations(filePath)

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("no-cross-feature-nested-imports"),
    )
  })

  it("should allow import from immediate sibling child file", async () => {
    const dirname = import.meta.dirname
    const filePath = join(dirname, "test-structure/polls/PollEditor/validators/index.ts")

    await expectNoCrossFeatureViolations(filePath)

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("no-cross-feature-nested-imports"),
    )
  })

  it("should allow import from own child", async () => {
    const dirname = import.meta.dirname
    const filePath = join(dirname, "test-structure/polls/PollEditor/validators/validateName.ts")

    await expectNoCrossFeatureViolations(filePath)

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("no-cross-feature-nested-imports"),
    )
  })
})
