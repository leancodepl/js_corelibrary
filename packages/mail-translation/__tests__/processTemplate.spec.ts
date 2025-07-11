import { TranslationData } from "../src/lib/loadTranslations"
import { processTemplate, Template } from "../src/lib/processTemplate"

describe("processTemplate function", () => {
    const mockTranslationData: TranslationData = {
        en: {
            greeting: "Hello",
            farewell: "Goodbye",
            welcome: "Welcome {name}!",
        },
        pl: {
            greeting: "Cześć",
            farewell: "Do widzenia",
            welcome: "Witaj {name}!",
        },
    }

    const mockTemplate: Template = {
        name: "test-template",
        mjml: `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>{{t 'greeting'}}</mj-text>
              <mj-text>{{t 'welcome', (name: "John")}}</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `,
        plaintext: '{{t "greeting"}} {{t "welcome", (name: "John")}}',
    }

    it("should process template and return translated mails and output templates", () => {
        const result = processTemplate(mockTemplate, mockTranslationData)

        expect(result.name).toBe("test-template")
        expect(result.translatedMails).toBeDefined()
        expect(result.outputTemplates).toBeDefined()
        expect(Array.isArray(result.outputTemplates)).toBe(true)
        expect(Object.keys(result.translatedMails)).toEqual(["en", "pl"])
    })

    it("should include output templates for Kratos mode", () => {
        const result = processTemplate(mockTemplate, mockTranslationData, {
            outputMode: "kratos",
        })

        expect(result.outputTemplates.length).toBeGreaterThan(0)
        
        const htmlTemplate = result.outputTemplates.find(t => t.filename === "test-template.gotmpl")
        expect(htmlTemplate).toBeDefined()
        expect(htmlTemplate?.content).toBeDefined()
        
        const plaintextTemplate = result.outputTemplates.find(t => t.filename === "test-template.plaintext.gotmpl")
        expect(plaintextTemplate).toBeDefined()
        expect(plaintextTemplate?.content).toBeDefined()
    })

    it("should include output templates for Razor mode", () => {
        const result = processTemplate(mockTemplate, mockTranslationData, {
            outputMode: "razor",
            defaultLanguage: "en",
        })

        expect(result.outputTemplates.length).toBeGreaterThan(0)
        
        const defaultHtmlTemplate = result.outputTemplates.find(t => t.filename === "test-template.cshtml")
        expect(defaultHtmlTemplate).toBeDefined()
        
        const polishHtmlTemplate = result.outputTemplates.find(t => t.filename === "test-template.pl.cshtml")
        expect(polishHtmlTemplate).toBeDefined()
    })

    it("should include individual translated mails for each language", () => {
        const result = processTemplate(mockTemplate, mockTranslationData)

        expect(result.translatedMails.en.name).toBe("test-template")
        expect(result.translatedMails.en.language).toBe("en")
        expect(result.translatedMails.pl.name).toBe("test-template")
        expect(result.translatedMails.pl.language).toBe("pl")
    })

    it("should translate HTML content correctly in individual mails", () => {
        const result = processTemplate(mockTemplate, mockTranslationData)

        expect(result.translatedMails.en.html).toContain("Hello")
        expect(result.translatedMails.en.html).toContain("Welcome John!")
        expect(result.translatedMails.pl.html).toContain("Cześć")
        expect(result.translatedMails.pl.html).toContain("Witaj John!")
    })

    it("should translate plaintext content correctly in individual mails", () => {
        const result = processTemplate(mockTemplate, mockTranslationData)

        expect(result.translatedMails.en.plaintext).toContain("Hello")
        expect(result.translatedMails.en.plaintext).toContain("Welcome John!")
        expect(result.translatedMails.pl.plaintext).toContain("Cześć")
        expect(result.translatedMails.pl.plaintext).toContain("Witaj John!")
    })

    it("should use default language when no translations provided", () => {
        const result = processTemplate(mockTemplate, {}, { defaultLanguage: "en" })

        expect(Object.keys(result.translatedMails)).toEqual(["en"])
        expect(result.translatedMails.en.language).toBe("en")
        expect(result.outputTemplates.length).toBeGreaterThan(0)
    })

    it("should handle template without plaintext", () => {
        const templateWithoutPlaintext: Template = {
            name: "test-template",
            mjml: mockTemplate.mjml,
        }

        const result = processTemplate(templateWithoutPlaintext, mockTranslationData)

        expect(result.translatedMails.en.plaintext).toBeUndefined()
        expect(result.translatedMails.pl.plaintext).toBeUndefined()
        expect(result.outputTemplates.length).toBeGreaterThan(0)
    })

    it("should preserve original MJML content in individual mails", () => {
        const result = processTemplate(mockTemplate, mockTranslationData)

        expect(result.translatedMails.en.mjml).toBe(mockTemplate.mjml)
        expect(result.translatedMails.pl.mjml).toBe(mockTemplate.mjml)
    })

    it("should handle different output modes", () => {
        const kratosResult = processTemplate(mockTemplate, mockTranslationData, {
            outputMode: "kratos",
        })
        const razorResult = processTemplate(mockTemplate, mockTranslationData, {
            outputMode: "razor",
        })

        expect(kratosResult.outputTemplates.length).toBeGreaterThan(0)
        expect(razorResult.outputTemplates.length).toBeGreaterThan(0)
    })

    it("should apply Kratos transformations for multiple languages", () => {
        const result = processTemplate(mockTemplate, mockTranslationData, {
            outputMode: "kratos",
        })

        // For Kratos with multiple languages, should contain template definitions in output templates
        const htmlTemplate = result.outputTemplates.find(t => t.filename === "test-template.gotmpl")
        expect(htmlTemplate?.content).toContain('{{define "en"}}')
        expect(htmlTemplate?.content).toContain('{{define "pl"}}')
        expect(htmlTemplate?.content).toContain("{{- if eq .Identity.traits.lang")
    })

    it("should apply Razor transformations for default language", () => {
        const result = processTemplate(mockTemplate, mockTranslationData, {
            outputMode: "razor",
            defaultLanguage: "en",
        })

        // For Razor, should return escaped content for default language in output templates
        const defaultHtmlTemplate = result.outputTemplates.find(t => t.filename === "test-template.cshtml")
        expect(defaultHtmlTemplate?.content).toBeDefined()
        expect(defaultHtmlTemplate?.content).not.toContain("{{define")
        // Should contain escaped @media if any (though not in this simple test)
    })
})
