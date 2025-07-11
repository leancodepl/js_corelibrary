import * as fs from "fs-extra"
import * as path from "path"
import { OutputTemplate } from "./generateOutputTemplates"
import { ProcessedTemplate } from "./processTemplate"

/**
 * Save processed templates using the output templates they contain
 */
export async function saveOutputs(
    processedTemplates: ProcessedTemplate[],
    outputPath: string,
): Promise<void> {
    // Collect all output templates from processed templates
    const allOutputTemplates: OutputTemplate[] = []
    for (const processedTemplate of processedTemplates) {
        allOutputTemplates.push(...processedTemplate.outputTemplates)
    }

    // Ensure output directory exists
    await fs.ensureDir(outputPath)

    // Save each template
    for (const template of allOutputTemplates) {
        const filePath = path.join(outputPath, template.filename)
        await fs.writeFile(filePath, template.content, "utf8")
    }

    // Log errors if any
    for (const processedTemplate of processedTemplates) {
        for (const [language, translatedMail] of Object.entries(processedTemplate.translatedMails)) {
            if (translatedMail.errors.length > 0) {
                console.warn(`Errors in ${translatedMail.name} (${language}):`, translatedMail.errors)
            }
        }
    }
}
