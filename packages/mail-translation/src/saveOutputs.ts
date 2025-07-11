import * as fs from "fs-extra"
import * as path from "path"
import { OutputTemplate } from "./generateOutputTemplates"
import { ProcessedTemplate } from "./processTemplate"

export async function saveOutputs(processedTemplates: ProcessedTemplate[], outputPath: string): Promise<void> {
    const allOutputTemplates: OutputTemplate[] = []
    for (const processedTemplate of processedTemplates) {
        allOutputTemplates.push(...processedTemplate.outputTemplates)
    }

    await fs.ensureDir(outputPath)

    for (const template of allOutputTemplates) {
        const filePath = path.join(outputPath, template.filename)
        await fs.writeFile(filePath, template.content, "utf8")
    }

    for (const processedTemplate of processedTemplates) {
        for (const [language, translatedMail] of Object.entries(processedTemplate.translatedMails)) {
            if (translatedMail.errors.length > 0) {
                console.warn(`Errors in ${translatedMail.name} (${language}):`, translatedMail.errors)
            }
        }
    }
}
