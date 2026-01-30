import * as path from "node:path"
import { generate } from "../src"

const kratosTestDir = path.join(import.meta.dirname, "kratos")

describe("generate function - Kratos mode", () => {
  const config = {
    translationsPath: path.join(kratosTestDir, "translations"),
    mailsPath: path.join(kratosTestDir, "mails"),
    plaintextMailsPath: path.join(kratosTestDir, "mails"),
    outputMode: "kratos" as const,
    defaultLanguage: "en",
  }

  let result: Awaited<ReturnType<typeof generate>>

  beforeAll(async () => {
    result = await generate(config)
  })

  it("should generate kratos templates matching snapshots", async () => {
    const sortedResult = result
      .map(template => ({
        ...template,
        outputTemplates: template.outputTemplates.toSorted((a, b) => a.filename.localeCompare(b.filename)),
      }))
      .toSorted((a, b) => a.name.localeCompare(b.name))

    expect(sortedResult).toMatchSnapshot()
  })

  it("should inject translations without parameters", async () => {
    expect(result).toHaveLength(2)

    const htmlTemplate = result.find(template => template.outputTemplates.some(o => o.filename === "welcome.gotmpl"))
    const plainTextTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "welcome.plaintext.gotmpl"),
    )

    expect(htmlTemplate?.name).toBe("welcome")
    expect(plainTextTemplate?.name).toBe("welcome")

    const htmlOutput = htmlTemplate?.outputTemplates.find(t => t.filename === "welcome.gotmpl")
    const plainTextOutput = plainTextTemplate?.outputTemplates.find(t => t.filename === "welcome.plaintext.gotmpl")

    expect(htmlOutput?.content).toContain("Welcome to our platform!")
    expect(htmlOutput?.content).toContain("Thank you for registering with us")

    expect(plainTextOutput?.content).toContain("Welcome to our platform!")
    expect(plainTextOutput?.content).toContain("Thank you for registering with us")
  })

  it("should inject parameterized translations with kratos bindings", async () => {
    const htmlTemplate = result.find(template => template.outputTemplates.some(o => o.filename === "welcome.gotmpl"))
    const plainTextTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "welcome.plaintext.gotmpl"),
    )

    const htmlOutput = htmlTemplate?.outputTemplates.find(t => t.filename === "welcome.gotmpl")
    const plainTextOutput = plainTextTemplate?.outputTemplates.find(t => t.filename === "welcome.plaintext.gotmpl")

    expect(htmlOutput?.content).toContain("Hello {{ .Identity.traits.first_name }}!")
    expect(htmlOutput?.content).toContain("Verification Code: {{ .VerificationCode }}")

    expect(plainTextOutput?.content).toContain("Hello {{ .Identity.traits.first_name }}!")
    expect(plainTextOutput?.content).toContain("Verification Code: {{ .VerificationCode }}")
  })

  it("should generate different content for different languages", async () => {
    const htmlTemplate = result.find(template => template.outputTemplates.some(o => o.filename === "welcome.gotmpl"))
    const plainTextTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "welcome.plaintext.gotmpl"),
    )

    const htmlOutput = htmlTemplate?.outputTemplates.find(t => t.filename === "welcome.gotmpl")
    const plainTextOutput = plainTextTemplate?.outputTemplates.find(t => t.filename === "welcome.plaintext.gotmpl")

    expect(htmlOutput?.content).toContain('{{define "en"}}')
    expect(htmlOutput?.content).toContain('{{define "pl"}}')
    expect(htmlOutput?.content).toContain("Welcome to our platform!")
    expect(htmlOutput?.content).toContain("Witamy na naszej platformie!")
    expect(htmlOutput?.content).toContain("Hello {{ .Identity.traits.first_name }}!")
    expect(htmlOutput?.content).toContain("Witaj {{ .Identity.traits.first_name }}!")

    expect(htmlOutput?.content).toContain('{{- if eq .Identity.traits.lang "pl" -}}')
    expect(htmlOutput?.content).toContain('{{ template "pl" . }}')
    expect(htmlOutput?.content).toContain("{{- else -}}")
    expect(htmlOutput?.content).toContain('{{ template "en" . }}')

    expect(plainTextOutput?.content).toContain('{{define "en"}}')
    expect(plainTextOutput?.content).toContain('{{define "pl"}}')
    expect(plainTextOutput?.content).toContain("Welcome to our platform!")
    expect(plainTextOutput?.content).toContain("Witamy na naszej platformie!")
  })

  it("should translate content from mjml-include components", async () => {
    const htmlTemplate = result.find(template => template.outputTemplates.some(o => o.filename === "welcome.gotmpl"))

    const htmlOutput = htmlTemplate?.outputTemplates.find(t => t.filename === "welcome.gotmpl")

    expect(htmlOutput?.content).toContain("This is an automated message. Please do not reply to this email.")
    expect(htmlOutput?.content).toContain("© 2024 Example Company. All rights reserved.")
    expect(htmlOutput?.content).toContain("To jest automatyczna wiadomość. Proszę nie odpowiadać na ten email.")
    expect(htmlOutput?.content).toContain("© 2024 Przykładowa Firma. Wszelkie prawa zastrzeżone.")
  })

  it("should process translations with multiple parameters", async () => {
    const htmlTemplate = result.find(template => template.outputTemplates.some(o => o.filename === "welcome.gotmpl"))
    const plainTextTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "welcome.plaintext.gotmpl"),
    )

    const htmlOutput = htmlTemplate?.outputTemplates.find(t => t.filename === "welcome.gotmpl")
    const plainTextOutput = plainTextTemplate?.outputTemplates.find(t => t.filename === "welcome.plaintext.gotmpl")

    expect(htmlOutput?.content).toContain(
      "Account: {{ .Identity.traits.email }} | Plan: {{ .Identity.traits.subscription_plan }}",
    )
    expect(htmlOutput?.content).toContain(
      "Konto: {{ .Identity.traits.email }} | Plan: {{ .Identity.traits.subscription_plan }}",
    )

    expect(plainTextOutput?.content).toContain(
      "Account: {{ .Identity.traits.email }} | Plan: {{ .Identity.traits.subscription_plan }}",
    )
    expect(plainTextOutput?.content).toContain(
      "Konto: {{ .Identity.traits.email }} | Plan: {{ .Identity.traits.subscription_plan }}",
    )
  })

  it("should use custom kratosLanguageVariable when provided", async () => {
    const configWithCustomLanguageVariable = {
      ...config,
      kratosLanguageVariable: ".Identity.traits.locale",
    }

    const customResult = await generate(configWithCustomLanguageVariable)

    const htmlTemplate = customResult.find(template =>
      template.outputTemplates.some(o => o.filename === "welcome.gotmpl"),
    )
    const plainTextTemplate = customResult.find(template =>
      template.outputTemplates.some(o => o.filename === "welcome.plaintext.gotmpl"),
    )

    const htmlOutput = htmlTemplate?.outputTemplates.find(t => t.filename === "welcome.gotmpl")
    const plainTextOutput = plainTextTemplate?.outputTemplates.find(t => t.filename === "welcome.plaintext.gotmpl")

    expect(htmlOutput?.content).toContain('{{- if eq .Identity.traits.locale "pl" -}}')
    expect(plainTextOutput?.content).toContain('{{- if eq .Identity.traits.locale "pl" -}}')

    expect(htmlOutput?.content).not.toContain(".Identity.traits.lang")
    expect(plainTextOutput?.content).not.toContain(".Identity.traits.lang")
  })

  it("should handle missing translations gracefully", async () => {
    const configWithMissingTranslations = {
      ...config,
      translationsPath: undefined,
      defaultLanguage: undefined,
    }

    const resultWithMissingTranslations = await generate(configWithMissingTranslations)

    const htmlTemplate = resultWithMissingTranslations.find(template =>
      template.outputTemplates.some(o => o.filename === "welcome.gotmpl"),
    )

    const htmlOutput = htmlTemplate?.outputTemplates.find(t => t.filename === "welcome.gotmpl")

    expect(htmlOutput?.content).toContain("welcome_title")
    expect(htmlOutput?.content).toContain("welcome_greeting")

    expect(htmlOutput?.content).not.toContain('((t "welcome_title"))')
    expect(htmlOutput?.content).not.toContain('((t "welcome_greeting", {"name": "{{ .Identity.traits.first_name }}"}))')
  })
})
