import * as path from "node:path"
import { generate } from "../src"

const razorTestDir = path.join(__dirname, "razor")

describe("generate function - Razor mode", () => {
  const config = {
    translationsPath: path.join(razorTestDir, "translations"),
    mailsPath: path.join(razorTestDir, "mails"),
    plaintextMailsPath: path.join(razorTestDir, "mails"),
    outputMode: "razor" as const,
    defaultLanguage: "en",
  }

  let result: Awaited<ReturnType<typeof generate>>

  beforeAll(async () => {
    result = await generate(config)
  })

  it("should generate razor templates matching snapshots", async () => {
    const sortedResult = result
      .map(template => ({
        ...template,
        outputTemplates: template.outputTemplates.toSorted((a, b) => a.filename.localeCompare(b.filename)),
      }))
      .toSorted((a, b) => a.name.localeCompare(b.name))

    expect(sortedResult).toMatchSnapshot()
  })

  it("should preserve razor syntax in templates", async () => {
    const notificationTemplate = result.find(template => template.name === "notification")
    const htmlTemplate = notificationTemplate?.outputTemplates.find(t => t.filename === "notification.cshtml")

    expect(htmlTemplate?.content).toContain("@Model.User.FullName")
    expect(htmlTemplate?.content).toContain("@Model.Status")
    expect(htmlTemplate?.content).toContain("@Model.ActionUrl")
    expect(htmlTemplate?.content).toContain("@Model.ReferenceNumber")
  })

  it("should inject translations without parameters", async () => {
    const htmlTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.cshtml"),
    )
    const plainTextTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.txt.cshtml"),
    )

    const englishHtml = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.cshtml")
    expect(englishHtml?.content).toContain("System Notification")
    expect(englishHtml?.content).toContain("Take Action Now")

    const englishTxt = plainTextTemplate?.outputTemplates.find(t => t.filename === "notification.txt.cshtml")
    expect(englishTxt?.content).toContain("System Notification")
    expect(englishTxt?.content).toContain("Take Action Now")
  })

  it("should inject parameterized translations with razor bindings", async () => {
    const htmlTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.cshtml"),
    )
    const plainTextTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.txt.cshtml"),
    )

    const englishHtml = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.cshtml")
    const englishTxt = plainTextTemplate?.outputTemplates.find(t => t.filename === "notification.txt.cshtml")

    expect(englishHtml?.content).toContain("Dear @Model.User.FullName,")
    expect(englishTxt?.content).toContain("Dear @Model.User.FullName,")

    expect(englishHtml?.content).toContain("Action required: @Model.RequiredAction")
    expect(englishTxt?.content).toContain("Action required: @Model.RequiredAction")

    expect(englishHtml?.content).toContain("Reference: @Model.ReferenceNumber")
    expect(englishTxt?.content).toContain("Reference: @Model.ReferenceNumber")
  })

  it("should generate different content for different languages", async () => {
    const htmlTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.cshtml"),
    )
    const plainTextTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.txt.cshtml"),
    )

    const englishHtml = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.cshtml")
    const polishHtml = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.pl.cshtml")
    const englishTxt = plainTextTemplate?.outputTemplates.find(t => t.filename === "notification.txt.cshtml")
    const polishTxt = plainTextTemplate?.outputTemplates.find(t => t.filename === "notification.pl.txt.cshtml")

    expect(englishHtml?.content).toContain("System Notification")
    expect(englishHtml?.content).toContain("Dear @Model.User.FullName,")
    expect(englishHtml?.content).toContain("Take Action Now")
    expect(englishHtml?.content).toContain("Action required:")

    expect(polishHtml?.content).toContain("Powiadomienie systemowe")
    expect(polishHtml?.content).toContain("Szanowny/a @Model.User.FullName,")
    expect(polishHtml?.content).toContain("Wykonaj działanie teraz")
    expect(polishHtml?.content).toContain("Wymagane działanie:")

    expect(englishTxt?.content).toContain("Dear @Model.User.FullName,")
    expect(polishTxt?.content).toContain("Szanowny/a @Model.User.FullName,")
  })

  it("should preserve razor syntax within translated parameters", async () => {
    const htmlTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.cshtml"),
    )

    const englishHtml = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.cshtml")

    expect(englishHtml?.content).toContain("@Model.User.FullName")
    expect(englishHtml?.content).toContain("@Model.Status")
    expect(englishHtml?.content).toContain("@Model.RequiredAction")
    expect(englishHtml?.content).toContain("@Model.ReferenceNumber")
    expect(englishHtml?.content).toContain("@Model.ActionUrl")
  })

  it("should escape razor conflicts in CSS rules", async () => {
    const htmlTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.cshtml"),
    )

    const englishHtml = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.cshtml")

    expect(englishHtml?.content).toContain("@@media only screen and (min-width:480px)")
    expect(englishHtml?.content).toContain("@@media only screen and (max-width:479px)")
    expect(englishHtml?.content).toContain("@@import url")
  })

  it("should translate content from mjml-include components", async () => {
    const htmlTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.cshtml"),
    )

    const englishHtml = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.cshtml")
    const polishHtml = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.pl.cshtml")

    expect(englishHtml?.content).toContain("Reference: @Model.ReferenceNumber")
    expect(englishHtml?.content).toContain("Need help? Contact our support team at support@example.com")

    expect(polishHtml?.content).toContain("Numer referencyjny: @Model.ReferenceNumber")
    expect(polishHtml?.content).toContain(
      "Potrzebujesz pomocy? Skontaktuj się z naszym zespołem wsparcia: support@example.com",
    )
  })

  it("should process translations with multiple parameters", async () => {
    const htmlTemplate = result.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.cshtml"),
    )

    const englishHtml = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.cshtml")
    const polishHtml = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.pl.cshtml")

    expect(englishHtml?.content).toContain(
      "Your account status has been updated to: @Model.Status as of @Model.UpdateDate.",
    )
    expect(polishHtml?.content).toContain(
      "Status Twojego konta został zaktualizowany na: @Model.Status z dniem @Model.UpdateDate.",
    )
  })

  it("should handle missing translations gracefully", async () => {
    const configWithMissingTranslations = {
      ...config,
      translationsPath: undefined,
      defaultLanguage: undefined,
    }

    const resultWithMissingTranslations = await generate(configWithMissingTranslations)
    const htmlTemplate = resultWithMissingTranslations.find(template =>
      template.outputTemplates.some(o => o.filename === "notification.cshtml"),
    )

    const htmlOutput = htmlTemplate?.outputTemplates.find(t => t.filename === "notification.cshtml")

    expect(htmlOutput?.content).toContain("notification_title")
    expect(htmlOutput?.content).toContain("user_greeting")

    expect(htmlOutput?.content).not.toContain('((t "notification_title"))')
    expect(htmlOutput?.content).not.toContain('((t "user_greeting", {"name": "@Model.User.FullName"}))')
  })
})
