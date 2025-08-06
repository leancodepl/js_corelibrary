import { join } from "path"
import { validateCrossFeatureImports } from "../src/commands/validateCrossFeatureImports"

describe("cross-feature-imports validation", () => {
  it("should detect violations in SurveyEditor (nested sibling child import)", async () => {
    const testDir = join(__dirname, "test-structure")
    const filePath = join(testDir, "surveys/SurveyEditor/index.tsx")
    const configPath = join(__dirname, "../src/.dependency-cruiser.json")

    // Mock console.error to capture output
    const originalError = console.error
    const errorOutput: string[] = []
    console.error = (...args: any[]) => errorOutput.push(args.join(" "))

    try {
      await validateCrossFeatureImports({
        directories: [filePath],
        configPath: configPath,
        tsConfigPath: join(__dirname, "../tsconfig.json"),
      })
    } catch (error: any) {
      // Expected to fail with violations
    }

    // Restore console.error
    console.error = originalError

    // Should find violations in SurveyEditor
    expect(errorOutput.length).toBeGreaterThan(0)
    expect(errorOutput.some(output => output.includes("cross-feature-nested-imports"))).toBe(true)
  }, 30000)

  it("should detect violations in SnapshotPollEditor (nested sibling child)", async () => {
    const testDir = join(__dirname, "test-structure")
    const filePath = join(testDir, "polls/SnapshotPollEditor/index.tsx")
    const configPath = join(__dirname, "../src/.dependency-cruiser.json")

    const originalError = console.error
    const errorOutput: string[] = []
    console.error = (...args: any[]) => errorOutput.push(args.join(" "))

    try {
      await validateCrossFeatureImports({
        directories: [filePath],
        configPath: configPath,
        tsConfigPath: join(__dirname, "../tsconfig.json"),
      })
    } catch (error: any) {
      // Expected to fail with violations
    }

    console.error = originalError

    // Should find violations in SnapshotPollEditor
    expect(errorOutput.length).toBeGreaterThan(0)
    expect(errorOutput.some(output => output.includes("cross-feature-nested-imports"))).toBe(true)
  }, 30000)

  it("should detect violations in ActivityEditor (nested sibling child import)", async () => {
    const testDir = join(__dirname, "test-structure")
    const filePath = join(testDir, "activities/index.tsx")
    const configPath = join(__dirname, "../src/.dependency-cruiser.json")

    const originalError = console.error
    const errorOutput: string[] = []
    console.error = (...args: any[]) => errorOutput.push(args.join(" "))

    try {
      await validateCrossFeatureImports({
        directories: [filePath],
        configPath: configPath,
        tsConfigPath: join(__dirname, "../tsconfig.json"),
      })
    } catch (error: any) {
      // Expected to fail with violations
    }

    console.error = originalError

    // Should find violations in ActivityEditor
    expect(errorOutput.length).toBeGreaterThan(0)
    expect(errorOutput.some(output => output.includes("cross-feature-nested-imports"))).toBe(true)
  }, 30000)
})
