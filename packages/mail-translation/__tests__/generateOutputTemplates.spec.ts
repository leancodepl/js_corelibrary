import { generateKratosOutputTemplates } from "../src/lib/generateKratosOutputTemplates"
import { generateOutputTemplates } from "../src/lib/generateOutputTemplates"
import { generateRazorOutputTemplates } from "../src/lib/generateRazorOutputTemplates"
import { TranslatedMail } from "../src/lib/processTemplate"

describe("generateOutputTemplates", () => {
    const mockTranslatedMails: { [language: string]: TranslatedMail[] } = {
        en: [
            {
                name: "welcome",
                language: "en",
                mjml: "<mjml><mj-body><mj-text>Welcome</mj-text></mj-body></mjml>",
                html: "<html><body>Welcome</body></html>",
                plaintext: "Welcome",
                errors: [],
            },
        ],
        pl: [
            {
                name: "welcome",
                language: "pl",
                mjml: "<mjml><mj-body><mj-text>Witaj</mj-text></mj-body></mjml>",
                html: "<html><body>Witaj</body></html>",
                plaintext: "Witaj",
                errors: [],
            },
        ],
    }

    describe("generateKratosOutputTemplates", () => {
        it("should generate Kratos templates with multiple languages", () => {
            const result = generateKratosOutputTemplates(mockTranslatedMails, "en")

            expect(result).toHaveLength(2) // HTML and plaintext templates
            
            const htmlTemplate = result.find(t => t.filename === "welcome.gotmpl")
            expect(htmlTemplate).toBeDefined()
            expect(htmlTemplate?.content).toContain('{{define "en"}}')
            expect(htmlTemplate?.content).toContain('{{define "pl"}}')
            expect(htmlTemplate?.content).toContain('{{- if eq .Identity.traits.lang "pl" -}}')
            expect(htmlTemplate?.content).toContain('<html><body>Welcome</body></html>')
            expect(htmlTemplate?.content).toContain('<html><body>Witaj</body></html>')

            const plaintextTemplate = result.find(t => t.filename === "welcome.plaintext.gotmpl")
            expect(plaintextTemplate).toBeDefined()
            expect(plaintextTemplate?.content).toContain('{{define "en"}}')
            expect(plaintextTemplate?.content).toContain('{{define "pl"}}')
            expect(plaintextTemplate?.content).toContain("Welcome")
            expect(plaintextTemplate?.content).toContain("Witaj")
        })

        it("should generate simple template for single language", () => {
            const singleLanguageMails = { en: mockTranslatedMails.en }
            const result = generateKratosOutputTemplates(singleLanguageMails, "en")

            expect(result).toHaveLength(2)
            
            const htmlTemplate = result.find(t => t.filename === "welcome.gotmpl")
            expect(htmlTemplate?.content).toBe("<html><body>Welcome</body></html>")
            
            const plaintextTemplate = result.find(t => t.filename === "welcome.plaintext.gotmpl")
            expect(plaintextTemplate?.content).toBe("Welcome")
        })
    })

    describe("generateRazorOutputTemplates", () => {
        it("should generate Razor templates with language-specific naming", () => {
            const result = generateRazorOutputTemplates(mockTranslatedMails, "en")

            expect(result).toHaveLength(4) // Default + Polish for HTML and plaintext
            
            // Default language files
            const defaultHtml = result.find(t => t.filename === "welcome.cshtml")
            expect(defaultHtml?.content).toBe("<html><body>Welcome</body></html>")
            
            const defaultPlaintext = result.find(t => t.filename === "welcome.txt.cshtml")
            expect(defaultPlaintext?.content).toBe("Welcome")
            
            // Polish language files
            const polishHtml = result.find(t => t.filename === "welcome.pl.cshtml")
            expect(polishHtml?.content).toBe("<html><body>Witaj</body></html>")
            
            const polishPlaintext = result.find(t => t.filename === "welcome.pl.txt.cshtml")
            expect(polishPlaintext?.content).toBe("Witaj")
        })

        it("should escape Razor conflicts", () => {
            const mailsWithCss: { [language: string]: TranslatedMail[] } = {
                en: [
                    {
                        name: "styled",
                        language: "en",
                        mjml: "",
                        html: "<style>@media screen { color: red; } @import url('font.css');</style>",
                        plaintext: undefined,
                        errors: [],
                    },
                ],
            }

            const result = generateRazorOutputTemplates(mailsWithCss, "en")
            const template = result.find(t => t.filename === "styled.cshtml")
            
            expect(template?.content).toContain("@@media screen")
            expect(template?.content).toContain("@@import url")
        })
    })

    describe("generateOutputTemplates", () => {
        it("should delegate to Kratos generator for kratos mode", () => {
            const result = generateOutputTemplates(mockTranslatedMails, "kratos", "en")
            
            expect(result).toHaveLength(2)
            expect(result.some(t => t.filename === "welcome.gotmpl")).toBe(true)
            expect(result.some(t => t.filename === "welcome.plaintext.gotmpl")).toBe(true)
        })

        it("should delegate to Razor generator for razor mode", () => {
            const result = generateOutputTemplates(mockTranslatedMails, "razor", "en")
            
            expect(result).toHaveLength(4)
            expect(result.some(t => t.filename === "welcome.cshtml")).toBe(true)
            expect(result.some(t => t.filename === "welcome.pl.cshtml")).toBe(true)
        })

        it("should throw error for unsupported mode", () => {
            expect(() => {
                generateOutputTemplates(mockTranslatedMails, "unsupported" as any, "en")
            }).toThrow("Unsupported output mode: unsupported")
        })
    })
}) 