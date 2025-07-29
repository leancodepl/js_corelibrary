/* eslint-disable no-console */
import { writeFileSync } from "fs"
import { mkdir } from "fs/promises"
import { join } from "path"

const swaggerUrl = "https://poeditor.com/public/api/swagger.yaml"
const schemaDir = "./openapi-schema"

export async function downloadSwaggerFile() {
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

export async function generateApiClient() {
  console.log("Generating API client...")

  const { spawn } = await import("child_process")

  return new Promise<void>((resolve, reject) => {
    const process = spawn(
      "npx",
      [
        "@openapitools/openapi-generator-cli",
        "generate",
        "-g",
        "typescript-axios",
        "-i",
        "./openapi-schema/swagger.yaml",
        "-o",
        "./src/poeditor/api.generated",
      ],
      {
        stdio: "inherit",
      },
    )

    process.on("close", code => {
      if (code === 0) {
        console.log("API client generated successfully!")
        resolve()
      } else {
        reject(new Error(`API client generation failed with code ${code}`))
      }
    })
  })
}

export async function generatePoeditorSchema() {
  await downloadSwaggerFile()
  await generateApiClient()
}

if (require.main === module) {
  ;(async () => {
    try {
      await generatePoeditorSchema()
    } catch (error) {
      console.error("Error:", error)
      process.exit(1)
    }
  })()
}
