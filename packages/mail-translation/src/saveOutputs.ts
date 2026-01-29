import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { ProcessedTemplate } from "./processTemplate"

export async function saveOutputs({
  processedTemplates,
  outputPath,
}: {
  processedTemplates: ProcessedTemplate[]
  outputPath: string
}) {
  await mkdir(outputPath, { recursive: true })

  const outputTemplates = processedTemplates.flatMap(processedTemplate => processedTemplate.outputTemplates)

  await Promise.all(
    outputTemplates.map(template => writeFile(join(outputPath, template.filename), template.content, "utf8")),
  )

  for (const processedTemplate of processedTemplates) {
    if (processedTemplate.mjmlParseErrors.length > 0) {
      console.warn(`Errors in ${processedTemplate.name}:`, processedTemplate.mjmlParseErrors)
    }
  }
}
