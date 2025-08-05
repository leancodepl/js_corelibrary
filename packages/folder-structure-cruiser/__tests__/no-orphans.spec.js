const { execSync } = require("child_process")
const path = require("path")

describe("no-orphans dependency cruiser rule", () => {
  const testDir = path.join(__dirname, "test-structure")
  const configPath = path.resolve(__dirname, "../src/.dependency-cruiser.json")

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
