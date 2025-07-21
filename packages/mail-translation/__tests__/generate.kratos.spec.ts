import * as path from "path"
import { generate } from "../src"

const kratosTestDir = path.join(__dirname, "kratos")

describe("generate function - Kratos mode snapshots", () => {
    const config = {
        translationsPath: path.join(kratosTestDir, "translations"),
        mailsPath: path.join(kratosTestDir, "mails"),
        plaintextMailsPath: path.join(kratosTestDir, "mails"),
        outputMode: "kratos" as const,
        defaultLanguage: "en",
    }
    it("should handle multiple languages in kratos mode", async () => {
        const result = await generate(config)
        
        const templates = result.find(template => template.name === "welcome")
        expect(templates?.outputTemplates).toBeDefined()
        
        const outputTemplate = templates?.outputTemplates.find(t => t.filename === "welcome.gotmpl")
        expect(outputTemplate?.content).toContain('{{define "en"}}')
        expect(outputTemplate?.content).toContain('{{define "pl"}}')
        expect(outputTemplate?.content).toContain('{{ template "en" . }}')
        
        expect(outputTemplate?.content).toMatchSnapshot("kratos-welcome-multilang")
    })
}) 