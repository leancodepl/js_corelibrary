import { exec } from "child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { promisify } from "util"

const execAsync = promisify(exec)

export interface ExtractedMessage {
  defaultMessage: string
  description?: string
  file?: string
}

export type ExtractedMessages = Record<string, ExtractedMessage>

export async function extractMessages(pattern = "src/**/*.{ts,tsx}"): Promise<ExtractedMessages> {
  const tempFile = join(tmpdir(), `messages-${Date.now()}.json`)

  try {
    const command = [
      "npx",
      "@formatjs/cli",
      "extract",
      `"${pattern}"`,
      "--out-file",
      `"${tempFile}"`,
      "--preserve-whitespace",
      "--extract-source-location",
    ].join(" ")

    await execAsync(command)

    const messagesText = readFileSync(tempFile, "utf-8")
    rmSync(tempFile)
    return JSON.parse(messagesText)
  } catch (error) {
    throw new Error(`Failed to extract messages. Error: ${error}`)
  }
}

export async function compileTranslations({
  inputDir,
  outputDir,
  options = {},
}: {
  inputDir: string
  outputDir: string
  options?: { ast?: boolean; format?: string }
}): Promise<void> {
  const { ast = true, format = "simple" } = options

  try {
    const command = [
      "npx",
      "@formatjs/cli",
      "compile-folder",
      ...(ast ? ["--ast"] : []),
      "--format",
      format,
      inputDir,
      outputDir,
    ].join(" ")

    await execAsync(command)
  } catch (error) {
    throw new Error(`Failed to compile translations. Error: ${error}`)
  }
}

export function createTranslationsTempDir(prefix = "intl-"): string {
  return mkdtempSync(join(tmpdir(), prefix))
}

export function writeTranslationsToTempDir({
  translations,
  language,
  tempDir,
}: {
  translations: Record<string, string>
  language: string
  tempDir: string
}): string {
  const filePath = join(tempDir, `${language}.json`)
  writeFileSync(filePath, JSON.stringify(translations, null, 2))
  return filePath
}
