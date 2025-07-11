import * as fs from "fs-extra"
import * as path from "path"
import { ProcessedTemplate } from "../src/lib/processTemplate"
import { saveOutputs } from "../src/lib/saveOutputs"

describe("mailSaver", () => {
    const testOutputDir = path.join(__dirname, "temp-output")

    beforeEach(async () => {
        await fs.ensureDir(testOutputDir)
    })

    afterEach(async () => {
        await fs.remove(testOutputDir)
    })

    const mockProcessedTemplates: ProcessedTemplate[] = [
        {
            name: "test-template",
            errors: [],
            translatedMails: {
                en: {
                    name: "test-template",
                    language: "en",
                    mjml: "<mjml><mj-body>Test</mj-body></mjml>",
                    html: "<html><body>Test EN</body></html>",
                    plaintext: "Test EN plaintext",
                    errors: [],
                },
                pl: {
                    name: "test-template",
                    language: "pl",
                    mjml: "<mjml><mj-body>Test</mj-body></mjml>",
                    html: "<html><body>Test PL</body></html>",
                    plaintext: "Test PL plaintext",
                    errors: [],
                },
            },
            outputTemplates: [
                {
                    filename: "test-template.gotmpl",
                    content:
                        '{{define "en"}}<html><body>Test EN</body></html>{{end}}{{define "pl"}}<html><body>Test PL</body></html>{{end}}',
                },
                {
                    filename: "test-template.plaintext.gotmpl",
                    content: '{{define "en"}}Test EN plaintext{{end}}{{define "pl"}}Test PL plaintext{{end}}',
                },
            ],
        },
    ]

    describe("saveProcessedTemplates", () => {
        it("should save output templates to files", async () => {
            await saveOutputs(mockProcessedTemplates, testOutputDir)

            // Check that files were created
            const files = await fs.readdir(testOutputDir)
            expect(files).toContain("test-template.gotmpl")
            expect(files).toContain("test-template.plaintext.gotmpl")

            // Check file contents
            const htmlContent = await fs.readFile(path.join(testOutputDir, "test-template.gotmpl"), "utf8")
            expect(htmlContent).toContain('{{define "en"}}')
            expect(htmlContent).toContain('{{define "pl"}}')

            const plaintextContent = await fs.readFile(
                path.join(testOutputDir, "test-template.plaintext.gotmpl"),
                "utf8",
            )
            expect(plaintextContent).toContain("Test EN plaintext")
            expect(plaintextContent).toContain("Test PL plaintext")
        })

        it("should handle multiple processed templates", async () => {
            const multipleTemplates: ProcessedTemplate[] = [
                {
                    ...mockProcessedTemplates[0],
                    name: "template-1",
                    outputTemplates: [{ filename: "template-1.gotmpl", content: "Template 1 content" }],
                },
                {
                    ...mockProcessedTemplates[0],
                    name: "template-2",
                    outputTemplates: [{ filename: "template-2.gotmpl", content: "Template 2 content" }],
                },
            ]

            await saveOutputs(multipleTemplates, testOutputDir)

            const files = await fs.readdir(testOutputDir)
            expect(files).toContain("template-1.gotmpl")
            expect(files).toContain("template-2.gotmpl")
        })

        it("should handle templates with errors", async () => {
            const templatesWithErrors: ProcessedTemplate[] = [
                {
                    ...mockProcessedTemplates[0],
                    translatedMails: {
                        en: {
                            ...mockProcessedTemplates[0].translatedMails.en,
                            errors: [{ line: 1, message: "Test error", tagName: "mj-test" }],
                        },
                    },
                },
            ]

            // Should not throw error, but log warnings
            const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation()

            await saveOutputs(templatesWithErrors, testOutputDir)

            expect(consoleWarnSpy).toHaveBeenCalledWith(
                "Errors in test-template (en):",
                expect.arrayContaining([
                    expect.objectContaining({
                        line: 1,
                        message: "Test error",
                        tagName: "mj-test",
                    }),
                ]),
            )

            consoleWarnSpy.mockRestore()
        })

        it("should handle empty processed templates", async () => {
            await saveOutputs([], testOutputDir)

            // Should not throw error
            const files = await fs.readdir(testOutputDir)
            expect(files).toEqual([])
        })

        it("should ensure output directory exists", async () => {
            const nonExistentDir = path.join(testOutputDir, "nested", "directory")

            await saveOutputs(mockProcessedTemplates, nonExistentDir)

            // Directory should be created
            const dirExists = await fs.pathExists(nonExistentDir)
            expect(dirExists).toBe(true)

            // Files should be saved
            const files = await fs.readdir(nonExistentDir)
            expect(files.length).toBeGreaterThan(0)
        })
    })
})
