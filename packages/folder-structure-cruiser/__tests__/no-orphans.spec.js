import { execSync } from "node:child_process"
import path from "node:path"

describe("no-orphans dependency cruiser rule", () => {
  vi.setTimeout(30000)

  const dirname = import.meta.dirname
  const testDir = path.join(dirname, "test-structure")
  const configPath = path.resolve(dirname, "../src/.dependency-cruiser.json")

  test("should flag orphaned files with fewer than 2 dependents", () => {
    const filePath = path.join(testDir, "surveys/orphan.ts")
    const result = execSync(`npx depcruise --config "${configPath}" "${filePath}"`, {
      cwd: testDir,
      encoding: "utf8",
    })
    expect(result).toContain("no-orphans")
  })

  test("should not flag files with multiple dependents", () => {
    const filePath = path.join(testDir, "polls/PollEditor/index.tsx")
    const result = execSync(`npx depcruise --config "${configPath}" "${filePath}"`, {
      cwd: testDir,
      encoding: "utf8",
    })
    expect(result).not.toContain("no-orphans")
  })
})
