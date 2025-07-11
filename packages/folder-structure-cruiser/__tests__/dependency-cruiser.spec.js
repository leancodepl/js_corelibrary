const { execSync } = require("child_process")
const path = require("path")

describe("Dependency Cruiser Rules", () => {
    const testDir = path.join(__dirname, "test-structure")
    const configPath = path.resolve(__dirname, "../src/dependency-cruiser.config.js")

    test("should allow import from direct sibling index", () => {
        const filePath = path.join(testDir, "polls/PollEditor/index.tsx")
        const result = execSync(`npx dependency-cruiser --config "${configPath}" "${filePath}"`, {
            cwd: testDir,
            encoding: "utf8",
        })
        expect(result).not.toContain("no-cross-feature-nested-imports")
    })

    test("should allow import from immediate sibling child file", () => {
        const filePath = path.join(testDir, "polls/PollEditor/index.tsx")
        let error = null
        try {
            execSync(`npx dependency-cruiser --config "${configPath}" "${filePath}"`, {
                cwd: testDir,
                encoding: "utf8",
            })
        } catch (e) {
            error = e
        }
        expect(error).toBeNull()
    })

    test("should allow import from own child", () => {
        const filePath = path.join(testDir, "polls/PollEditor/index.tsx")
        let error = null
        try {
            execSync(`npx dependency-cruiser --config "${configPath}" "${filePath}"`, {
                cwd: testDir,
                encoding: "utf8",
            })
        } catch (e) {
            error = e
        }
        expect(error).toBeNull()
    })

    test("should forbid import from nested sibling child", () => {
        const filePath = path.join(testDir, "surveys/SurveyEditor/index.tsx")
        try {
            execSync(`npx dependency-cruiser --config "${configPath}" "${filePath}"`, {
                cwd: testDir,
                encoding: "utf8",
            })
            throw new Error("Expected violations but none found")
        } catch (error) {
            expect(error.stdout || error.stderr || error.message).toContain("no-cross-feature-nested-imports")
        }
    })

    test("should forbid imports in SnapshotPollEditor as commented", () => {
        const filePath = path.join(testDir, "polls/SnapshotPollEditor/index.tsx")
        try {
            execSync(`npx dependency-cruiser --config "${configPath}" "${filePath}"`, {
                cwd: testDir,
                encoding: "utf8",
            })
            throw new Error("Expected violations but none found")
        } catch (error) {
            expect(error.stdout || error.stderr || error.message).toContain("no-cross-feature-nested-imports")
        }
    })
})
