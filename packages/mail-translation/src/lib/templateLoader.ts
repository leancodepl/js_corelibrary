import * as fs from "fs-extra"
import * as path from "path"
import { OutputMode } from "./loadConfig"

export interface TemplateData {
    [templateName: string]: string
}

/**
 * Load all MJML templates from the mails directory
 */
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

/**
 * Load all plaintext templates from the plaintext mails directory
 */
export async function loadPlaintextTemplates(
    plaintextMailsPath: string,
    outputMode: OutputMode = "kratos",
): Promise<TemplateData> {
    const templates: TemplateData = {}

    try {
        const exists = await fs.pathExists(plaintextMailsPath)
        if (!exists) {
            // If plaintext directory doesn't exist, return empty templates
            return templates
        }

        const files = await fs.readdir(plaintextMailsPath)

        // Filter files based on output mode
        let plaintextFiles: string[]
        if (outputMode === "kratos") {
            // Look for .plaintext.gotmpl files
            plaintextFiles = files.filter(file => file.endsWith(".plaintext.gotmpl"))
        } else {
            // Look for .txt.cshtml files
            plaintextFiles = files.filter(file => file.endsWith(".txt.cshtml"))
        }

        for (const file of plaintextFiles) {
            let templateName: string
            if (outputMode === "kratos") {
                // Remove .plaintext.gotmpl extension
                templateName = file.replace(/\.plaintext\.gotmpl$/, "")
            } else {
                // Remove .txt.cshtml extension
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
