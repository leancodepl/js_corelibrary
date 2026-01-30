import { execSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

export interface ExtractedMessage {
  defaultMessage: string
  description?: string
  file?: string
}

export type ExtractedMessages = Record<string, ExtractedMessage>

export function extractMessages(pattern = "src/**/*.{ts,tsx}"): ExtractedMessages {
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

    execSync(command)

    const messagesText = readFileSync(tempFile, "utf-8")
    rmSync(tempFile)
    return JSON.parse(messagesText)
  } catch (error) {
    throw new Error(`Failed to extract messages. Error: ${error}`)
  }
}

export function compileTranslations({
  inputDir,
  outputDir,
  options = {},
}: {
  inputDir: string
  outputDir: string
  options?: { ast?: boolean; format?: string }
}) {
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
    execSync(command)
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
