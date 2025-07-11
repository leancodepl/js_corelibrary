import { processTemplate, Template } from "../src"

describe("processTemplate function - Kratos mode", () => {
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
                            <mj-text>{{t 'welcome_user', (name: "{{ .Identity.traits.name }}")}}</mj-text>
                        </mj-column>
                    </mj-section>
                </mj-body>
            </mjml>
        `,
        plaintext: '{{t "greeting"}} {{t "welcome_user", (name: "{{ .Identity.traits.name }}")}}',
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
                            <mj-text>{{t "recovery_code_message", (code: "{{ .RecoveryCode }}")}}</mj-text>
                            <mj-text>{{ .RecoveryCode }}</mj-text>
                            <mj-text>{{t "greeting_with_name", (name: "{{ .Identity.traits.name }}")}}</mj-text>
                            <mj-text>{{t "account_status", (status: "{{ .Identity.state }}")}}</mj-text>
                            <mj-text>{{t "email_verification_footer"}}</mj-text>
                        </mj-column>
                    </mj-section>
                </mj-body>
            </mjml>
        `,
        plaintext: `{{t "email_verification_title"}}

{{t "email_verification_greeting"}}

{{t "email_verification_instructions"}}

{{t "recovery_code_message", (code: "{{ .RecoveryCode }}")}}

{{ .RecoveryCode }}

{{t "greeting_with_name", (name: "{{ .Identity.traits.name }}")}}

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

    describe("Basic Kratos output generation", () => {
        it("should generate Kratos output templates", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { outputMode: "kratos" })

            expect(result.outputTemplates.length).toBeGreaterThan(0)
            const htmlTemplate = result.outputTemplates.find(t => t.filename === "basic-template.gotmpl")
            expect(htmlTemplate).toBeDefined()
            expect(htmlTemplate?.content).toBeDefined()
        })

        it("should generate Kratos plaintext templates when plaintext content exists", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { outputMode: "kratos" })

            const plaintextTemplate = result.outputTemplates.find(t => t.filename === "basic-template.plaintext.gotmpl")
            expect(plaintextTemplate).toBeDefined()
            expect(plaintextTemplate?.content).toBeDefined()
        })

        it("should not generate plaintext templates when no plaintext content", () => {
            const result = processTemplate(templateWithoutPlaintext, mockTranslationData, { outputMode: "kratos" })

            const plaintextTemplates = result.outputTemplates.filter(t => t.filename.includes(".plaintext."))
            expect(plaintextTemplates).toHaveLength(0)
        })
    })

    describe("Multiple language handling", () => {
        it("should generate template definitions for multiple languages", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { outputMode: "kratos" })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "basic-template.gotmpl")
            expect(htmlTemplate?.content).toContain('{{define "en"}}')
            expect(htmlTemplate?.content).toContain('{{define "pl"}}')
            expect(htmlTemplate?.content).toContain('{{define "es"}}')
            expect(htmlTemplate?.content).toContain("{{- if eq .Identity.traits.lang")
        })

        it("should generate conditional logic for language selection", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { outputMode: "kratos" })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "basic-template.gotmpl")
            expect(htmlTemplate?.content).toContain('{{- if eq .Identity.traits.lang "pl" -}}')
            expect(htmlTemplate?.content).toContain('{{ template "pl" . }}')
            expect(htmlTemplate?.content).toContain('{{- else if eq .Identity.traits.lang "es" -}}')
            expect(htmlTemplate?.content).toContain('{{ template "es" . }}')
            expect(htmlTemplate?.content).toContain("{{- else -}}")
            expect(htmlTemplate?.content).toContain('{{ template "en" . }}')
            expect(htmlTemplate?.content).toContain("{{- end -}}")
        })

        it("should generate plaintext template definitions for multiple languages", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { outputMode: "kratos" })

            const plaintextTemplate = result.outputTemplates.find(t => t.filename === "basic-template.plaintext.gotmpl")
            expect(plaintextTemplate?.content).toContain('{{define "en"}}')
            expect(plaintextTemplate?.content).toContain('{{define "pl"}}')
            expect(plaintextTemplate?.content).toContain('{{define "es"}}')
            expect(plaintextTemplate?.content).toContain("{{- if eq .Identity.traits.lang")
        })

        it("should include translated content in each language definition", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, { outputMode: "kratos" })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "basic-template.gotmpl")
            expect(htmlTemplate?.content).toContain("Hello")
            expect(htmlTemplate?.content).toContain("Welcome {{ .Identity.traits.name }}!")
            expect(htmlTemplate?.content).toContain("Cześć")
            expect(htmlTemplate?.content).toContain("Witaj {{ .Identity.traits.name }}!")
            expect(htmlTemplate?.content).toContain("Hola")
            expect(htmlTemplate?.content).toContain("¡Bienvenido {{ .Identity.traits.name }}!")
        })
    })

    describe("Single language handling", () => {
        it("should generate single content for single language without template definitions", () => {
            const singleLangData = { en: mockTranslationData.en }
            const result = processTemplate(basicTemplate, singleLangData, { outputMode: "kratos" })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "basic-template.gotmpl")
            expect(htmlTemplate?.content).not.toContain('{{define "en"}}')
            expect(htmlTemplate?.content).not.toContain("{{- if eq .Identity.traits.lang")
            expect(htmlTemplate?.content).toContain("Hello")
            expect(htmlTemplate?.content).toContain("Welcome {{ .Identity.traits.name }}!")
        })

        it("should generate single plaintext content for single language", () => {
            const singleLangData = { en: mockTranslationData.en }
            const result = processTemplate(basicTemplate, singleLangData, { outputMode: "kratos" })

            const plaintextTemplate = result.outputTemplates.find(t => t.filename === "basic-template.plaintext.gotmpl")
            expect(plaintextTemplate?.content).not.toContain('{{define "en"}}')
            expect(plaintextTemplate?.content).not.toContain("{{- if eq .Identity.traits.lang")
            expect(plaintextTemplate?.content).toContain("Hello")
            expect(plaintextTemplate?.content).toContain("Welcome {{ .Identity.traits.name }}!")
        })
    })

    describe("Default language configuration", () => {
        it("should use custom default language", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, {
                outputMode: "kratos",
                defaultLanguage: "pl",
            })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "basic-template.gotmpl")
            expect(htmlTemplate?.content).toContain('{{ template "pl" . }}')
            expect(htmlTemplate?.content).toContain("{{- else -}}")
        })

        it("should place default language in else clause", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, {
                outputMode: "kratos",
                defaultLanguage: "es",
            })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "basic-template.gotmpl")
            expect(htmlTemplate?.content).toContain('{{- if eq .Identity.traits.lang "en" -}}')
            expect(htmlTemplate?.content).toContain('{{ template "en" . }}')
            expect(htmlTemplate?.content).toContain('{{- else if eq .Identity.traits.lang "pl" -}}')
            expect(htmlTemplate?.content).toContain('{{ template "pl" . }}')
            expect(htmlTemplate?.content).toContain("{{- else -}}")
            expect(htmlTemplate?.content).toContain('{{ template "es" . }}')
        })
    })

    describe("Template variables and Kratos syntax", () => {
        it("should preserve Kratos template variables in translations", () => {
            const result = processTemplate(complexTemplate, mockTranslationData, { outputMode: "kratos" })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "complex-template.gotmpl")
            expect(htmlTemplate?.content).toContain("Your recovery code is: {{ .RecoveryCode }}")
            expect(htmlTemplate?.content).toContain("Twój kod odzyskiwania to: {{ .RecoveryCode }}")
            expect(htmlTemplate?.content).toContain("Hello {{ .Identity.traits.name }}, welcome to our platform!")
            expect(htmlTemplate?.content).toContain("Cześć {{ .Identity.traits.name }}, witaj na naszej platformie!")
        })

        it("should preserve standalone Kratos variables", () => {
            const result = processTemplate(complexTemplate, mockTranslationData, { outputMode: "kratos" })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "complex-template.gotmpl")
            expect(htmlTemplate?.content).toContain("{{ .RecoveryCode }}")
        })

        it("should handle complex parameterized translations in plaintext", () => {
            const result = processTemplate(complexTemplate, mockTranslationData, { outputMode: "kratos" })

            const plaintextTemplate = result.outputTemplates.find(
                t => t.filename === "complex-template.plaintext.gotmpl",
            )
            expect(plaintextTemplate?.content).toContain("Your recovery code is: {{ .RecoveryCode }}")
            expect(plaintextTemplate?.content).toContain("Twój kod odzyskiwania to: {{ .RecoveryCode }}")
        })
    })

    describe("No translations scenario", () => {
        it("should generate Kratos template with default language when no translations", () => {
            const result = processTemplate(
                basicTemplate,
                {},
                {
                    outputMode: "kratos",
                    defaultLanguage: "en",
                },
            )

            expect(result.outputTemplates.length).toBeGreaterThan(0)
            const htmlTemplate = result.outputTemplates.find(t => t.filename === "basic-template.gotmpl")
            expect(htmlTemplate).toBeDefined()
            expect(htmlTemplate?.content).toContain("greeting")
            expect(htmlTemplate?.content).toContain("welcome_user")
        })

        it("should not generate template definitions when no translations", () => {
            const result = processTemplate(
                basicTemplate,
                {},
                {
                    outputMode: "kratos",
                    defaultLanguage: "en",
                },
            )

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "basic-template.gotmpl")
            expect(htmlTemplate?.content).not.toContain("{{define")
            expect(htmlTemplate?.content).not.toContain("{{- if eq .Identity.traits.lang")
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

            const result = processTemplate(templateWithMissingTranslations, mockTranslationData, {
                outputMode: "kratos",
            })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "missing-translations-template.gotmpl")
            expect(htmlTemplate?.content).toContain("Hello")
            expect(htmlTemplate?.content).toContain("Cześć")
            expect(htmlTemplate?.content).toContain("nonexistent_key")
        })

        it("should handle very long template names", () => {
            const longNameTemplate: Template = {
                ...basicTemplate,
                name: "very-long-template-name-that-exceeds-normal-length-expectations-and-might-cause-issues-in-some-systems",
            }

            const result = processTemplate(longNameTemplate, mockTranslationData, { outputMode: "kratos" })

            const htmlTemplate = result.outputTemplates.find(
                t =>
                    t.filename ===
                    "very-long-template-name-that-exceeds-normal-length-expectations-and-might-cause-issues-in-some-systems.gotmpl",
            )
            expect(htmlTemplate).toBeDefined()
            expect(htmlTemplate?.content).toContain("Hello")
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

            const result = processTemplate(whitespaceTemplate, mockTranslationData, { outputMode: "kratos" })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "whitespace-template.gotmpl")
            expect(htmlTemplate).toBeDefined()
            expect(htmlTemplate?.content).toBeDefined()
        })
    })

    describe("MJML compilation with Kratos mode", () => {
        it("should apply MJML options during Kratos template compilation", () => {
            const result = processTemplate(basicTemplate, mockTranslationData, {
                outputMode: "kratos",
                mjmlOptions: {
                    validationLevel: "strict",
                },
            })

            const htmlTemplate = result.outputTemplates.find(t => t.filename === "basic-template.gotmpl")
            expect(htmlTemplate).toBeDefined()
            expect(htmlTemplate?.content).toBeDefined()
        })

        it("should handle MJML compilation errors in Kratos mode", () => {
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

            const result = processTemplate(invalidTemplate, mockTranslationData, { outputMode: "kratos" })

            expect(result.errors).toBeDefined()
            const htmlTemplate = result.outputTemplates.find(t => t.filename === "invalid-template.gotmpl")
            expect(htmlTemplate).toBeDefined()
        })
    })
})
