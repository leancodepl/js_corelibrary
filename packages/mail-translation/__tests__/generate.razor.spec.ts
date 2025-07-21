import * as path from "path"
import { generate } from "../src"

const razorTestDir = path.join(__dirname, "razor")

describe("generate function - Razor mode snapshots", () => {
    const config = {
        translationsPath: path.join(razorTestDir, "translations"),
        mailsPath: path.join(razorTestDir, "mails"),
        plaintextMailsPath: path.join(razorTestDir, "mails"),
        outputMode: "razor" as const,
        defaultLanguage: "en",
    }

    it("should generate razor templates matching snapshots", async () => {
        const result = await generate(config)
        
        // Sort results for consistent snapshots
        const sortedResult = result
            .map(template => ({
                ...template,
                outputTemplates: template.outputTemplates.sort((a, b) => a.filename.localeCompare(b.filename))
            }))
            .sort((a, b) => a.name.localeCompare(b.name))

        expect(sortedResult).toMatchSnapshot()
    })

    it("should preserve razor syntax in templates", async () => {
        const result = await generate(config)
        
        const notificationTemplate = result.find(template => template.name === "notification")
        const htmlTemplate = notificationTemplate?.outputTemplates.find(t => t.filename === "notification.cshtml")
        
        expect(htmlTemplate?.content).toContain("@Model.User.FullName")
        expect(htmlTemplate?.content).toContain("@Model.Status")
        expect(htmlTemplate?.content).toContain("@Model.ActionUrl")
        expect(htmlTemplate?.content).toContain("@Model.ReferenceNumber")
    })
}) 