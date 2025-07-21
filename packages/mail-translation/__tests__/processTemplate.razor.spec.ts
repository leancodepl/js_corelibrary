import * as path from "path"
import { processTemplate, Template } from "../src"

const MAILS_PATH = path.join(__dirname, "mails")

describe("processTemplate function - Razor mode", () => {
    const mockTranslationData = {
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
            greeting_with_name: "Hola {name}, ¡bienvenido a nuestra plataforma!",
        },
    }

    const basicMjmlTemplate: Template = {
        name: "basic-template",
        content: `
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
        isPlaintext: false,
    }

    const basicPlaintextTemplate: Template = {
        name: "basic-template",
        content: '{{t "greeting"}} {{t "welcome_user", (name: "@Model.UserName")}}',
        isPlaintext: true,
    }

    const complexMjmlTemplate: Template = {
        name: "complex-template",
        content: `
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
        isPlaintext: false,
    }

    const complexPlaintextTemplate: Template = {
        name: "complex-template",
        content: `{{t "email_verification_title"}}

{{t "email_verification_greeting"}}

{{t "email_verification_instructions"}}

{{t "recovery_code_message", (code: "@Model.RecoveryCode")}}

@Model.RecoveryCode

{{t "greeting_with_name", (name: "@Model.UserName")}}

{{t "email_verification_footer"}}

{{t "footer_auto_generated"}}

{{t "footer_company_info"}}`,
        isPlaintext: true,
    }

    const htmlOnlyTemplate: Template = {
        name: "html-only-template",
        content: `
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
        isPlaintext: false,
    }

    describe("Basic Razor output generation", () => {
        it("should generate Razor output templates for MJML", () => {
            const result = processTemplate(basicMjmlTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            expect(result.outputTemplates.length).toBeGreaterThan(0)
            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            expect(defaultTemplate).toBeDefined()
        })

        it("should generate Razor output templates for plaintext", () => {
            const result = processTemplate(basicPlaintextTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            expect(result.outputTemplates.length).toBeGreaterThan(0)
            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.txt.cshtml")
            expect(defaultTemplate).toBeDefined()
        })

        it("should generate language-specific Razor templates for MJML", () => {
            const result = processTemplate(basicMjmlTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            const polishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.pl.cshtml")
            const spanishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.es.cshtml")

            expect(defaultTemplate).toBeDefined()
            expect(polishTemplate).toBeDefined()
            expect(spanishTemplate).toBeDefined()
        })

        it("should generate language-specific Razor templates for plaintext", () => {
            const result = processTemplate(basicPlaintextTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.txt.cshtml")
            const polishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.pl.txt.cshtml")
            const spanishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.es.txt.cshtml")

            expect(defaultTemplate).toBeDefined()
            expect(polishTemplate).toBeDefined()
            expect(spanishTemplate).toBeDefined()
        })
    })

    describe("Translation processing", () => {
        it("should process simple translations in MJML templates", () => {
            const result = processTemplate(basicMjmlTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            const polishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.pl.cshtml")

            expect(defaultTemplate?.content).toContain("Hello")
            expect(polishTemplate?.content).toContain("Cześć")
        })

        it("should process simple translations in plaintext templates", () => {
            const result = processTemplate(basicPlaintextTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.txt.cshtml")
            const polishTemplate = result.outputTemplates.find(t => t.filename === "basic-template.pl.txt.cshtml")

            expect(defaultTemplate?.content).toContain("Hello")
            expect(polishTemplate?.content).toContain("Cześć")
        })

        it("should handle parameterized translations in MJML templates", () => {
            const result = processTemplate(complexMjmlTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "complex-template.cshtml")
            expect(defaultTemplate?.content).toContain("Your recovery code is: @Model.RecoveryCode")
        })
    })

    describe("Template structure validation", () => {
        it("should return correct template structure for MJML", () => {
            const result = processTemplate(basicMjmlTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            expect(result.name).toBe("basic-template")
            expect(result.outputTemplates.length).toBeGreaterThan(0)
            expect(result.errors).toBeDefined()

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            expect(defaultTemplate?.filename).toBe("basic-template.cshtml")
            expect(defaultTemplate?.content).toBeDefined()
        })

        it("should return correct template structure for plaintext", () => {
            const result = processTemplate(basicPlaintextTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            expect(result.name).toBe("basic-template")
            expect(result.outputTemplates.length).toBeGreaterThan(0)
            expect(result.errors).toHaveLength(0) // Plaintext has no MJML errors

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.txt.cshtml")
            expect(defaultTemplate?.filename).toBe("basic-template.txt.cshtml")
            expect(defaultTemplate?.content).toBeDefined()
        })
    })

    describe("Razor-specific functionality", () => {
        it("should escape @media and @import in CSS", () => {
            const cssTemplate: Template = {
                name: "css-template",
                content: `
                    <mjml>
                        <mj-head>
                            <mj-style>
                                @media (max-width: 600px) {
                                    .test { display: block; }
                                }
                                @import url('fonts.css');
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
                isPlaintext: false,
            }

            const result = processTemplate(cssTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "css-template.cshtml")
            expect(defaultTemplate?.content).toContain("@@media")
            expect(defaultTemplate?.content).toContain("@@import")
        })

        it("should preserve Razor model syntax", () => {
            const result = processTemplate(complexMjmlTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "complex-template.cshtml")
            expect(defaultTemplate?.content).toContain("@Model.RecoveryCode")
            expect(defaultTemplate?.content).toContain("@Model.UserName")
            expect(defaultTemplate?.content).toContain("@Model.AccountStatus")
        })
    })

    describe("MJML compilation", () => {
        it("should apply MJML options during Razor template compilation", () => {
            const result = processTemplate(basicMjmlTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            const defaultTemplate = result.outputTemplates.find(t => t.filename === "basic-template.cshtml")
            expect(defaultTemplate).toBeDefined()
            expect(defaultTemplate?.content).toBeDefined()
        })

        it("should handle MJML compilation errors in Razor mode", () => {
            const invalidTemplate: Template = {
                name: "invalid-template",
                content: `
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
                isPlaintext: false,
            }

            const result = processTemplate(invalidTemplate, mockTranslationData, {
                outputMode: "razor",
                defaultLanguage: "en",
                mailsPath: MAILS_PATH,
            })

            expect(result.errors).toBeDefined()
            const defaultTemplate = result.outputTemplates.find(t => t.filename === "invalid-template.cshtml")
            expect(defaultTemplate).toBeDefined()
        })
    })
})
