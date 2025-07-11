import * as fs from "fs-extra"
import * as path from "path"
import { OutputMode } from "./loadConfig"

export interface TemplateData {
    [templateName: string]: string
}

export async function loadTemplates(mailsPath: string): Promise<TemplateData> {
    const templates: TemplateData = {}

    try {
        const exists = await fs.pathExists(mailsPath)
        if (!exists) {
            throw new Error(`Mails directory not found: ${mailsPath}`)
        }

        const files = await fs.readdir(mailsPath)
        const mjmlFiles = files.filter(file => path.extname(file) === ".mjml")

        for (const file of mjmlFiles) {
            const templateName = path.basename(file, ".mjml")
            const filePath = path.join(mailsPath, file)
            const content = await fs.readFile(filePath, "utf8")
            templates[templateName] = content
        }

        return templates
    } catch (error) {
        throw new Error(`Failed to load templates: ${error}`)
    }
}

export async function loadPlaintextTemplates(
    plaintextMailsPath: string,
    outputMode: OutputMode = "kratos",
): Promise<TemplateData> {
    const templates: TemplateData = {}

    try {
        const exists = await fs.pathExists(plaintextMailsPath)
        if (!exists) {
            return templates
        }

        const files = await fs.readdir(plaintextMailsPath)

        let plaintextFiles: string[]
        if (outputMode === "kratos") {
            plaintextFiles = files.filter(file => file.endsWith(".plaintext.gotmpl"))
        } else {
            plaintextFiles = files.filter(file => file.endsWith(".txt.cshtml"))
        }

        for (const file of plaintextFiles) {
            let templateName: string
            if (outputMode === "kratos") {
                templateName = file.replace(/\.plaintext\.gotmpl$/, "")
            } else {
                templateName = file.replace(/\.txt\.cshtml$/, "")
            }

            const filePath = path.join(plaintextMailsPath, file)
            const content = await fs.readFile(filePath, "utf8")
            templates[templateName] = content
        }

        return templates
    } catch (error) {
        throw new Error(`Failed to load plaintext templates: ${error}`)
    }
}
