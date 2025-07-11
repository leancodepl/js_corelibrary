import * as fs from "fs-extra"
import * as path from "path"
import { GenerateResult } from "./generate"
import { OutputTemplate } from "./generateOutputTemplates"

export async function saveOutputs(generateResult: GenerateResult, outputPath: string): Promise<void> {
    const { processedTemplates } = generateResult

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
