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

  it("should detect violations in SurveyEditor (nested sibling child import)", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "surveys/SurveyEditor/index.tsx")

    const violationsCount = await validateCrossFeatureImports({
      directories: [filePath],
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

    const violationsCount = await validateCrossFeatureImports({
      directories: [filePath],
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

    const violationsCount = await validateCrossFeatureImports({
      directories: [filePath],
    })

    expect(violationsCount).toBeGreaterThan(0)

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("cross-feature-nested-imports"),
    )
  }, 30000)

  it("should allow import from direct sibling index", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "polls/PollEditor/index.tsx")

    await validateCrossFeatureImports({
      directories: [filePath],
    })

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("no-cross-feature-nested-imports"),
    )
  })

  it("should allow import from immediate sibling child file", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "polls/PollEditor/index.tsx")

    await validateCrossFeatureImports({
      directories: [filePath],
    })

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("no-cross-feature-nested-imports"),
    )
  })

  it("should allow import from own child", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "polls/PollEditor/index.tsx")

    await validateCrossFeatureImports({
      directories: [filePath],
    })

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("no-cross-feature-nested-imports"),
    )
  })

  it("should not report modules matched by a global ignore pattern", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    // SurveyEditor's only violation is the import of wizards/ActivityWizard;
    // the config ignores /wizards/ for every command, so nothing is reported.
    const filePath = join(testDir, "surveys/SurveyEditor/index.tsx")
    const configPath = join(dirname, "global-ignore.config.json")

    const violationsCount = await validateCrossFeatureImports({ directories: [filePath], configPath })

    expect(violationsCount).toBe(0)
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("cross-feature-nested-imports"),
    )
  }, 30000)

  it("should not report modules matched by a command-specific ignore pattern", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "surveys/SurveyEditor/index.tsx")
    const configPath = join(dirname, "command-ignore.config.json")

    const violationsCount = await validateCrossFeatureImports({ directories: [filePath], configPath })

    expect(violationsCount).toBe(0)
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("cross-feature-nested-imports"),
    )
  }, 30000)

  it("should not flag imports of node builtins or npm packages", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "consumers/BuiltinConsumer/index.tsx")

    const violationsCount = await validateCrossFeatureImports({ directories: [filePath] })

    expect(violationsCount).toBe(0)
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("cross-feature-nested-imports"),
    )
  }, 30000)

  it("should limit the analysis to the configured scope", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "surveys/SurveyEditor/index.tsx")
    const configPath = join(dirname, "scope.config.json")

    const violationsCount = await validateCrossFeatureImports({ directories: [filePath], configPath })

    expect(violationsCount).toBe(0)
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("cross-feature-nested-imports"),
    )
  }, 30000)

  it("should reject a config with an unknown option", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "consumers/RouteChildConsumer/index.tsx")
    const configPath = join(dirname, "unknown-key.config.json")

    await expect(validateCrossFeatureImports({ directories: [filePath], configPath })).rejects.toThrow(
      /Unrecognized key[\S\s]*crossFeatureImport/,
    )
  }, 30000)

  it("should throw when the given config file does not exist", async () => {
    const dirname = import.meta.dirname
    const filePath = join(dirname, "test-structure/surveys/SurveyEditor/index.tsx")
    const configPath = join(dirname, "does-not-exist.config.json")

    await expect(validateCrossFeatureImports({ directories: [filePath], configPath })).rejects.toThrow(
      /Config file not found/,
    )
  }, 30000)

  it("should not crash when no config path is provided", async () => {
    const dirname = import.meta.dirname
    const filePath = join(dirname, "test-structure/surveys/SurveyEditor/index.tsx")

    // `--config` is optional; with no default config file in the working
    // directory the command runs with built-in defaults.
    await expect(validateCrossFeatureImports({ directories: [filePath] })).resolves.toBeTypeOf("number")
  }, 30000)
})
