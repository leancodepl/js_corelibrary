import * as fs from "fs-extra"
import * as path from "path"
import { loadPlaintextTemplates, loadTemplates } from "../src/lib/templateLoader"

describe("templateLoader", () => {
    const testDir = path.join(__dirname, "temp-templates")
    const testMailsDir = path.join(testDir, "mails")
    const testPlaintextDir = path.join(testDir, "plaintext")

    beforeEach(async () => {
        await fs.ensureDir(testMailsDir)
        await fs.ensureDir(testPlaintextDir)
    })

    afterEach(async () => {
        await fs.remove(testDir)
    })

    describe("loadTemplates", () => {
        it("should load MJML templates from directory", async () => {
            // Create test templates
            await fs.writeFile(path.join(testMailsDir, "test1.mjml"), "<mjml><mj-body>Test 1</mj-body></mjml>")
            await fs.writeFile(path.join(testMailsDir, "test2.mjml"), "<mjml><mj-body>Test 2</mj-body></mjml>")
            await fs.writeFile(path.join(testMailsDir, "not-mjml.txt"), "Should be ignored")

            const templates = await loadTemplates(testMailsDir)

            expect(Object.keys(templates)).toEqual(["test1", "test2"])
            expect(templates.test1).toBe("<mjml><mj-body>Test 1</mj-body></mjml>")
            expect(templates.test2).toBe("<mjml><mj-body>Test 2</mj-body></mjml>")
        })

        it("should throw error if directory does not exist", async () => {
            await expect(loadTemplates("/nonexistent/path")).rejects.toThrow("Mails directory not found")
        })

        it("should return empty object if no MJML files found", async () => {
            await fs.writeFile(path.join(testMailsDir, "not-mjml.txt"), "Should be ignored")

            const templates = await loadTemplates(testMailsDir)

            expect(templates).toEqual({})
        })
    })

    describe("loadPlaintextTemplates", () => {
        it("should load Kratos plaintext templates (.plaintext.gotmpl)", async () => {
            await fs.writeFile(path.join(testPlaintextDir, "test1.plaintext.gotmpl"), "Test 1 plaintext")
            await fs.writeFile(path.join(testPlaintextDir, "test2.plaintext.gotmpl"), "Test 2 plaintext")
            await fs.writeFile(path.join(testPlaintextDir, "test3.txt.cshtml"), "Should be ignored in kratos mode")

            const templates = await loadPlaintextTemplates(testPlaintextDir, "kratos")

            expect(Object.keys(templates)).toEqual(["test1", "test2"])
            expect(templates.test1).toBe("Test 1 plaintext")
            expect(templates.test2).toBe("Test 2 plaintext")
        })

        it("should load Razor plaintext templates (.txt.cshtml)", async () => {
            await fs.writeFile(path.join(testPlaintextDir, "test1.txt.cshtml"), "Test 1 plaintext")
            await fs.writeFile(path.join(testPlaintextDir, "test2.txt.cshtml"), "Test 2 plaintext")
            await fs.writeFile(path.join(testPlaintextDir, "test3.plaintext.gotmpl"), "Should be ignored in razor mode")

            const templates = await loadPlaintextTemplates(testPlaintextDir, "razor")

            expect(Object.keys(templates)).toEqual(["test1", "test2"])
            expect(templates.test1).toBe("Test 1 plaintext")
            expect(templates.test2).toBe("Test 2 plaintext")
        })

        it("should return empty object if directory does not exist", async () => {
            const templates = await loadPlaintextTemplates("/nonexistent/path")

            expect(templates).toEqual({})
        })

        it("should default to kratos mode", async () => {
            await fs.writeFile(path.join(testPlaintextDir, "test1.plaintext.gotmpl"), "Test 1 plaintext")

            const templates = await loadPlaintextTemplates(testPlaintextDir)

            expect(templates.test1).toBe("Test 1 plaintext")
        })
    })
})
