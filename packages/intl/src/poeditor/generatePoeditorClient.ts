/* eslint-disable no-console */
import { execSync } from "child_process"
import { writeFileSync } from "fs"
import { mkdir } from "fs/promises"
import { join } from "path"

const swaggerUrl = "https://poeditor.com/public/api/swagger.yaml"
const schemaDir = "./src/poeditor/openapi-schema"

try {
  generatePOEditorClient()
} catch (error) {
  console.error("Error:", error)
  process.exit(1)
}

export async function generatePOEditorClient() {
  await downloadSwaggerFile()
  generateApiClient()
}

async function downloadSwaggerFile() {
  console.log("Downloading POEditor swagger file...")

  const response = await fetch(swaggerUrl)
  if (!response.ok) {
    throw new Error(`Failed to download swagger file: ${response.statusText}`)
  }

  const content = await response.text()

  await mkdir(schemaDir, { recursive: true })

  const filePath = join(schemaDir, "swagger.yaml")
  writeFileSync(filePath, content)
  console.log(`Swagger file saved to ${filePath}`)
}

function generateApiClient() {
  console.log("Generating API client...")

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
    console.log("API client generated successfully!")
  } catch (error) {
    throw new Error(`API client generation failed. Error: ${error}`)
  }
}
