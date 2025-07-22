import { mkdir, writeFile } from "fs/promises"
import { join } from "path"
import { OutputTemplate } from "./generateOutputTemplates"
import { ProcessedTemplate } from "./processTemplate"

export async function saveOutputs(processedTemplates: ProcessedTemplate[], outputPath: string): Promise<void> {
    const allOutputTemplates: OutputTemplate[] = []
    for (const processedTemplate of processedTemplates) {
        allOutputTemplates.push(...processedTemplate.outputTemplates)
    }

    await mkdir(outputPath, { recursive: true })

    const outputs: Record<string, string> = {}
    for (const template of allOutputTemplates) {
        const filePath = join(outputPath, template.filename)
        outputs[filePath] = template.content
    }

    await Promise.all(Object.entries(outputs).map(([file, output]) => writeFile(file, output, "utf8")))

    for (const processedTemplate of processedTemplates) {
        if (processedTemplate.errors.length > 0) {
            console.warn(`Errors in ${processedTemplate.name}:`, processedTemplate.errors)
        }
    }
}
