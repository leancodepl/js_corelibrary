import { TranslationData } from "../src/loadTranslations"
import { processTemplate, Template } from "../src/processTemplate"

describe("processTemplate function - Razor mode", () => {
    const mockTranslationData: TranslationData = {
        en: {
            greeting: "Hello",
            farewell: "Goodbye",
            welcome: "Welcome {name}!",
            welcome_user: "Welcome {name}!",
            greeting_with_name: "Hello {name}, welcome to our platform!",
            recovery_code_message: "Your recovery code is: {code}",
            account_status: "Your account status is: {status}",
            email_verification_title: "Email Verification",
            email_verification_greeting: "Hello,",
            email_verification_instructions: "Please enter the following code to verify your email address:",
            email_verification_footer: "If you didn't request this verification, please ignore this email.",
            footer_auto_generated: "This message was generated automatically.",
            footer_company_info: "Company Ltd. All rights reserved.",
        },
        pl: {
            greeting: "Cześć",
            farewell: "Do widzenia",
            welcome: "Witaj {name}!",
            welcome_user: "Witaj {name}!",
            greeting_with_name: "Cześć {name}, witaj na naszej platformie!",
            recovery_code_message: "Twój kod odzyskiwania to: {code}",
            account_status: "Status twojego konta to: {status}",
            email_verification_title: "Weryfikacja Email",
            email_verification_greeting: "Witaj,",
            email_verification_instructions: "Proszę wprowadzić poniższy kod, aby zweryfikować swój adres email:",
            email_verification_footer: "Jeśli nie prosiłeś o tę weryfikację, zignoruj ten email.",
            footer_auto_generated: "Ta wiadomość została wygenerowana automatycznie.",
            footer_company_info: "Firma Sp. z o.o. Wszelkie prawa zastrzeżone.",
        },
        es: {
            greeting: "Hola",
            farewell: "Adiós",
            welcome: "¡Bienvenido {name}!",
            welcome_user: "¡Bienvenido {name}!",
            greeting_with_name: "Hola {name}, ¡bienvenido a nuestra plataforma!",
        },
    }

    const basicTemplate: Template = {
        name: "basic-template",
        mjml: `
            <mjml>
                <mj-body>
                    <mj-section>
                        <mj-column>
                            <mj-text>{{t 'greeting'}}</mj-text>
                            <mj-text>{{t 'welcome_user', (name: "@Model.UserName")}}</mj-text>
                        </mj-column>
                    </mj-section>
                </mj-body>
            </mjml>
        `,
        plaintext: '{{t "greeting"}} {{t "welcome_user", (name: "@Model.UserName")}}',
    }

    const complexTemplate: Template = {
        name: "complex-template",
        mjml: `
            <mjml>
                <mj-head>
                    <mj-title>{{t "email_verification_title"}}</mj-title>
                </mj-head>
                <mj-body>
                    <mj-section>
                        <mj-column>
                            <mj-text>{{t "email_verification_greeting"}}</mj-text>
                            <mj-text>{{t "email_verification_instructions"}}</mj-text>
                            <mj-text>{{t "recovery_code_message", (code: "@Model.RecoveryCode")}}</mj-text>
                            <mj-text>@Model.RecoveryCode</mj-text>
                            <mj-text>{{t "greeting_with_name", (name: "@Model.UserName")}}</mj-text>
                            <mj-text>{{t "account_status", (status: "@Model.AccountStatus")}}</mj-text>
                            <mj-text>{{t "email_verification_footer"}}</mj-text>
                        </mj-column>
                    </mj-section>
                </mj-body>
            </mjml>
        `,
        plaintext: `{{t "email_verification_title"}}

{{t "email_verification_greeting"}}

{{t "email_verification_instructions"}}

{{t "recovery_code_message", (code: "@Model.RecoveryCode")}}

@Model.RecoveryCode

{{t "greeting_with_name", (name: "@Model.UserName")}}

{{t "email_verification_footer"}}

{{t "footer_auto_generated"}}

{{t "footer_company_info"}}`,
    }

    const templateWithoutPlaintext: Template = {
        name: "html-only-template",
        mjml: `
            <mjml>
                <mj-body>
                    <mj-section>
                        <mj-column>
                            <mj-text>{{t 'greeting'}}</mj-text>
                        </mj-column>
                    </mj-section>
                </mj-body>
            </mjml>
        `,
    }

    describe("Basic Razor output generation", () => {
        it("should generate Razor output templates", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { outputMode: "razor" })

            expect(result.outputTemplates.length).toBeGreaterThan(0)
            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            expect(defaultTemplate).toBeDefined()
        })

        it("should generate language-specific Razor templates", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { 
                outputMode: "razor", 
                defaultLanguage: "en" 
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            const polishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.pl.cshtml")
            const spanishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.es.cshtml")

            expect(defaultTemplate).toBeDefined()
            expect(polishTemplate).toBeDefined()
            expect(spanishTemplate).toBeDefined()
        })

        it("should generate Razor plaintext templates when plaintext content exists", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { 
                outputMode: "razor", 
                defaultLanguage: "en" 
            })

            const defaultPlaintextTemplate = result.outputTemplates.find(t => t.filename === "basic-template.txt.cshtml")
            const polishPlaintextTemplate = result.outputTemplates.find(t => t.filename === "basic-template.pl.txt.cshtml")

            expect(defaultPlaintextTemplate).toBeDefined()
            expect(polishPlaintextTemplate).toBeDefined()
        })

        it("should not generate plaintext templates when no plaintext content", () => {
            const result = processTemplate(templateWithoutPlaintext, mockTranslationData, { 
                outputMode: "razor", 
                defaultLanguage: "en" 
            })

            const plaintextTemplates = result.outputTemplates.filter(t => t.filename.includes(".txt."))
            expect(plaintextTemplates).toHaveLength(0)
        })
    })

    describe("Language-specific content", () => {
        it("should contain correct translations in each language file", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { 
                outputMode: "razor", 
                defaultLanguage: "en" 
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            const polishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.pl.cshtml")
            const spanishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.es.cshtml")

            expect(defaultTemplate?.content).toContain("Hello")
            expect(defaultTemplate?.content).toContain("Welcome @Model.UserName!")
            
            expect(polishTemplate?.content).toContain("Cześć")
            expect(polishTemplate?.content).toContain("Witaj @Model.UserName!")
            
            expect(spanishTemplate?.content).toContain("Hola")
            expect(spanishTemplate?.content).toContain("¡Bienvenido @Model.UserName!")
        })

        it("should contain correct translations in plaintext files", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { 
                outputMode: "razor", 
                defaultLanguage: "en" 
            })

            const defaultPlaintextTemplate = result.outputTemplates.find(t => t.filename === "basic-template.txt.cshtml")
            const polishPlaintextTemplate = result.outputTemplates.find(t => t.filename === "basic-template.pl.txt.cshtml")

            expect(defaultPlaintextTemplate?.content).toContain("Hello")
            expect(defaultPlaintextTemplate?.content).toContain("Welcome @Model.UserName!")
            
            expect(polishPlaintextTemplate?.content).toContain("Cześć")
            expect(polishPlaintextTemplate?.content).toContain("Witaj @Model.UserName!")
        })
    })

    describe("Default language configuration", () => {
        it("should use custom default language in Razor mode", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { 
                outputMode: "razor", 
                defaultLanguage: "pl" 
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            const englishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.en.cshtml")

            expect(defaultTemplate?.content).toContain("Cześć")
            expect(englishTemplate?.content).toContain("Hello")
        })

        it("should generate correct file names with custom default language", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { 
                outputMode: "razor", 
                defaultLanguage: "es" 
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            const englishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.en.cshtml")
            const polishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.pl.cshtml")

            expect(defaultTemplate).toBeDefined()
            expect(englishTemplate).toBeDefined()
            expect(polishTemplate).toBeDefined()
            
            expect(defaultTemplate?.content).toContain("Hola")
            expect(englishTemplate?.content).toContain("Hello")
            expect(polishTemplate?.content).toContain("Cześć")
        })
    })

    describe("@media and @import escaping", () => {
        it("should escape @media and @import in Razor mode", () => {
            const templateWithMedia: Template = {
                name: "media-template",
                mjml: `
                    <mjml>
                        <mj-head>
                            <mj-style>
                                @media (max-width: 600px) { .responsive { width: 100% !important; } }
                                @import url('https://fonts.googleapis.com/css?family=Open+Sans');
                            </mj-style>
                        </mj-head>
                        <mj-body>
                            <mj-section>
                                <mj-column>
                                    <mj-text>{{t 'greeting'}}</mj-text>
                                </mj-column>
                            </mj-section>
                        </mj-body>
                    </mjml>
                `,
            }

            const result = processTemplate(templateWithMedia, mockTranslationData, { outputMode: "razor" })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "media-template.cshtml")
            expect(defaultTemplate?.content).toContain("@@media (max-width: 600px)")
            expect(defaultTemplate?.content).toContain(
                "@@import url('https://fonts.googleapis.com/css?family=Open+Sans')",
            )
            const userProvidedCssSection = defaultTemplate?.content.match(
                /<style type="text\/css">\s*@@media \(max-width: 600px\)[\s\S]*?<\/style>/,
            )
            expect(userProvidedCssSection).toBeTruthy()
        })

        it("should escape @media and @import in all language files", () => {
            const templateWithMedia: Template = {
                name: "media-template",
                mjml: `
                    <mjml>
                        <mj-head>
                            <mj-style>
                                @media (max-width: 600px) { .responsive { width: 100% !important; } }
                                @import url('https://fonts.googleapis.com/css?family=Open+Sans');
                            </mj-style>
                        </mj-head>
                        <mj-body>
                            <mj-section>
                                <mj-column>
                                    <mj-text>{{t 'greeting'}}</mj-text>
                                </mj-column>
                            </mj-section>
                        </mj-body>
                    </mjml>
                `,
            }

            const result = processTemplate(templateWithMedia, mockTranslationData, { outputMode: "razor" })

            const allTemplates = result.outputTemplates.filter(t => t.filename.endsWith(".cshtml"))
            
            allTemplates.forEach(template => {
                expect(template.content).toContain("@@media (max-width: 600px)")
                expect(template.content).toContain("@@import url('https://fonts.googleapis.com/css?family=Open+Sans')")
            })
        })

        it("should not escape already escaped @media and @import", () => {
            const templateWithEscapedMedia: Template = {
                name: "escaped-media-template",
                mjml: `
                    <mjml>
                        <mj-head>
                            <mj-style>
                                @@media (max-width: 600px) { .responsive { width: 100% !important; } }
                                @@import url('https://fonts.googleapis.com/css?family=Open+Sans');
                            </mj-style>
                        </mj-head>
                        <mj-body>
                            <mj-section>
                                <mj-column>
                                    <mj-text>{{t 'greeting'}}</mj-text>
                                </mj-column>
                            </mj-section>
                        </mj-body>
                    </mjml>
                `,
            }

            const result = processTemplate(templateWithEscapedMedia, mockTranslationData, { outputMode: "razor" })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "escaped-media-template.cshtml")
            expect(defaultTemplate?.content).toContain("@@media (max-width: 600px)")
            expect(defaultTemplate?.content).toContain("@@import url('https://fonts.googleapis.com/css?family=Open+Sans')")
            expect(defaultTemplate?.content).not.toContain("@@@media")
            expect(defaultTemplate?.content).not.toContain("@@@import")
        })
    })

    describe("Razor template variables", () => {
        it("should preserve Razor template variables in translations", () => {
            const result = processTemplate(complexTemplate, mockTranslationData, { outputMode: "razor" })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "complex-template.cshtml")
            const polishTemplate = result.outputTemplates.find(t => t.filename === "complex-template.pl.cshtml")

            expect(defaultTemplate?.content).toContain("Your recovery code is: @Model.RecoveryCode")
            expect(defaultTemplate?.content).toContain("Hello @Model.UserName, welcome to our platform!")
            
            expect(polishTemplate?.content).toContain("Twój kod odzyskiwania to: @Model.RecoveryCode")
            expect(polishTemplate?.content).toContain("Cześć @Model.UserName, witaj na naszej platformie!")
        })

        it("should preserve standalone Razor variables", () => {
            const result = processTemplate(complexTemplate, mockTranslationData, { outputMode: "razor" })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "complex-template.cshtml")
            expect(defaultTemplate?.content).toContain("@Model.RecoveryCode")
        })

        it("should handle Razor variables in plaintext templates", () => {
            const result = processTemplate(complexTemplate, mockTranslationData, { outputMode: "razor" })

            const defaultPlaintextTemplate = result.outputTemplates.find(t => t.filename === "complex-template.txt.cshtml")
            const polishPlaintextTemplate = result.outputTemplates.find(t => t.filename === "complex-template.pl.txt.cshtml")

            expect(defaultPlaintextTemplate?.content).toContain("Your recovery code is: @Model.RecoveryCode")
            expect(polishPlaintextTemplate?.content).toContain("Twój kod odzyskiwania to: @Model.RecoveryCode")
        })
    })

    describe("No translations scenario", () => {
        it("should generate Razor template with default language when no translations", () => {
            const result = processTemplate(basicTemplate, {}, { 
                outputMode: "razor", 
                defaultLanguage: "en" 
            })

            expect(result.outputTemplates.length).toBeGreaterThan(0)
            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            expect(defaultTemplate).toBeDefined()
            expect(defaultTemplate?.content).toContain("greeting")
            expect(defaultTemplate?.content).toContain("welcome_user")
        })

        it("should only generate default language files when no translations", () => {
            const result = processTemplate(basicTemplate, {}, { 
                outputMode: "razor", 
                defaultLanguage: "en" 
            })

            const htmlTemplates = result.outputTemplates.filter(t => t.filename.endsWith(".cshtml") && !t.filename.includes(".txt."))
            const plaintextTemplates = result.outputTemplates.filter(t => t.filename.endsWith(".txt.cshtml"))
            
            expect(htmlTemplates).toHaveLength(1)
            expect(htmlTemplates[0].filename).toBe("basic-template.cshtml")
            expect(plaintextTemplates).toHaveLength(1)
            expect(plaintextTemplates[0].filename).toBe("basic-template.txt.cshtml")
        })
    })

    describe("Edge cases", () => {
        it("should handle templates with missing translations", () => {
            const templateWithMissingTranslations: Template = {
                name: "missing-translations-template",
                mjml: `
                    <mjml>
                        <mj-body>
                            <mj-section>
                                <mj-column>
                                    <mj-text>{{t 'greeting'}}</mj-text>
                                    <mj-text>{{t 'nonexistent_key'}}</mj-text>
                                </mj-column>
                            </mj-section>
                        </mj-body>
                    </mjml>
                `,
            }

            const result = processTemplate(templateWithMissingTranslations, mockTranslationData, { outputMode: "razor" })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "missing-translations-template.cshtml")
            const polishTemplate = result.outputTemplates.find(t => t.filename === "missing-translations-template.pl.cshtml")

            expect(defaultTemplate?.content).toContain("Hello")
            expect(defaultTemplate?.content).toContain("nonexistent_key")
            expect(polishTemplate?.content).toContain("Cześć")
            expect(polishTemplate?.content).toContain("nonexistent_key")
        })

        it("should handle very long template names", () => {
            const longNameTemplate: Template = {
                ...basicTemplate,
                name: "very-long-template-name-that-exceeds-normal-length-expectations-and-might-cause-issues-in-some-systems",
            }

            const result = processTemplate(longNameTemplate, mockTranslationData, { outputMode: "razor" })

            const defaultTemplate = result.outputTemplates.find(t => 
                t.filename === "very-long-template-name-that-exceeds-normal-length-expectations-and-might-cause-issues-in-some-systems.cshtml"
            )
            expect(defaultTemplate).toBeDefined()
            expect(defaultTemplate?.content).toContain("Hello")
        })

        it("should handle templates with only whitespace", () => {
            const whitespaceTemplate: Template = {
                name: "whitespace-template",
                mjml: `
                    <mjml>
                        <mj-body>
                            <mj-section>
                                <mj-column>
                                    <mj-text>   </mj-text>
                                </mj-column>
                            </mj-section>
                        </mj-body>
                    </mjml>
                `,
                plaintext: "   ",
            }

            const result = processTemplate(whitespaceTemplate, mockTranslationData, { outputMode: "razor" })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "whitespace-template.cshtml")
            expect(defaultTemplate).toBeDefined()
            expect(defaultTemplate?.content).toBeDefined()
        })
    })



    describe("MJML compilation with Razor mode", () => {
        it("should apply MJML options during Razor template compilation", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, {
                outputMode: "razor",
                mjmlOptions: {
                    validationLevel: "strict"
                }
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            expect(defaultTemplate).toBeDefined()
            expect(defaultTemplate?.content).toBeDefined()
        })

        it("should handle MJML compilation errors in Razor mode", () => {
            const invalidTemplate: Template = {
                name: "invalid-template",
                mjml: `
                    <mjml>
                        <mj-body>
                            <mj-section>
                                <mj-column>
                                    <mj-invalid-tag>{{t 'greeting'}}</mj-invalid-tag>
                                </mj-column>
                            </mj-section>
                        </mj-body>
                    </mjml>
                `,
            }

            const result = processTemplate(invalidTemplate, mockTranslationData, { outputMode: "razor" })

            expect(result.errors).toBeDefined()
            const defaultTemplate = result.outputTemplates.find(t => t.filename === "invalid-template.cshtml")
            expect(defaultTemplate).toBeDefined()
        })
    })

    describe("File naming conventions", () => {
        it("should generate correct file names for different languages", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { 
                outputMode: "razor", 
                defaultLanguage: "en" 
            })

            const fileNames = result.outputTemplates.map(t => t.filename).sort()
            
            expect(fileNames).toContain("basic-template.cshtml")
            expect(fileNames).toContain("basic-template.pl.cshtml")
            expect(fileNames).toContain("basic-template.es.cshtml")
            expect(fileNames).toContain("basic-template.txt.cshtml")
            expect(fileNames).toContain("basic-template.pl.txt.cshtml")
            expect(fileNames).toContain("basic-template.es.txt.cshtml")
        })

        it("should not include language suffix for default language", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { 
                outputMode: "razor", 
                defaultLanguage: "pl" 
            })

            const fileNames = result.outputTemplates.map(t => t.filename).sort()
            
            expect(fileNames).toContain("basic-template.cshtml") // Default (pl)
            expect(fileNames).toContain("basic-template.en.cshtml")
            expect(fileNames).toContain("basic-template.es.cshtml")
            expect(fileNames).not.toContain("basic-template.pl.cshtml")
        })
    })
}) 