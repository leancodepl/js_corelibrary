import { readdir, readFile } from "fs/promises"
import { basename, extname, join } from "path"
import { OutputMode } from "./config"
import { Template } from "./processTemplate"

export interface TemplateData {
    [templateName: string]: string
}

export async function loadMjmlTemplates(mailsPath: string): Promise<Template[]> {
    const templates: Template[] = []

    try {
        const files = await readdir(mailsPath)
        const mjmlFiles = files.filter(file => extname(file) === ".mjml")

        for (const file of mjmlFiles) {
            const templateName = basename(file, ".mjml")
            const filePath = join(mailsPath, file)
            const content = await readFile(filePath, "utf8")
            templates.push({
                name: templateName,
                content,
                isPlaintext: false,
            })
        }

        return templates
    } catch (error) {
        throw new Error(`Failed to load templates: ${error}`)
    }
}

export async function loadPlaintextTemplates(plaintextMailsPath: string, outputMode: OutputMode): Promise<Template[]> {
    const templates: Template[] = []

    try {
        const files = await readdir(plaintextMailsPath)

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

            const filePath = join(plaintextMailsPath, file)
            const content = await readFile(filePath, "utf8")
            templates.push({
                name: templateName,
                content,
                isPlaintext: true,
            })
        }

        return templates
    } catch (error) {
        throw new Error(`Failed to load plaintext templates: ${error}`)
    }
}
