import { execSync } from "node:child_process"
import { writeFileSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { logger } from "../logger"

const swaggerUrl = "https://poeditor.com/public/api/swagger.yaml"
const schemaDir = "./src/poeditor/openapi-schema"

try {
  generatePOEditorClient()
} catch (error) {
  logger.error("Error:", error as Error)
  process.exit(1)
}

export async function generatePOEditorClient() {
  await downloadSwaggerFile()
  generateApiClient()
}

async function downloadSwaggerFile() {
  logger.info("Downloading POEditor swagger file...")

  const response = await fetch(swaggerUrl)
  if (!response.ok) {
    throw new Error(`Failed to download swagger file: ${response.statusText}`)
  }

  const content = await response.text()

  await mkdir(schemaDir, { recursive: true })

  const filePath = join(schemaDir, "swagger.yaml")
  writeFileSync(filePath, content)
  logger.success(`Swagger file saved to ${filePath}`)
}

function generateApiClient() {
  logger.info("Generating API client...")

  try {
    const command = [
      "npx",
      "@openapitools/openapi-generator-cli",
      "generate",
      "-g",
      "typescript-axios",
      "-i",
      "./src/poeditor/openapi-schema/swagger.yaml",
      "-o",
      "./src/poeditor/api.generated",
    ].join(" ")

    execSync(command)
    logger.success("API client generated successfully!")
  } catch (error) {
    throw new Error(`API client generation failed. Error: ${error}`)
  }
}
