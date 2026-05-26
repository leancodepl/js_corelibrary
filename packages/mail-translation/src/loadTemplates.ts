import { ResultAsync } from "neverthrow"
import { readdir, readFile } from "node:fs/promises"
import { basename, extname, join } from "node:path"
import type { LoadMjmlTemplatesError, LoadPlaintextTemplatesError } from "./MailTranslationError"
import { OutputMode } from "./config"
import { Template } from "./processTemplate"

export function loadMjmlTemplates(mailsPath: string): ResultAsync<Template[], LoadMjmlTemplatesError> {
  return ResultAsync.fromPromise(readMjmlTemplates(mailsPath), (cause): LoadMjmlTemplatesError => ({
    kind: "loadMjmlTemplatesFailed",
    mailsPath,
    cause,
  }))
}

async function readMjmlTemplates(mailsPath: string): Promise<Template[]> {
  const files = await readdir(mailsPath)
  const mjmlFiles = files.filter(file => extname(file) === ".mjml")

  return Promise.all(
    mjmlFiles.map(async file => {
      const templateName = basename(file, ".mjml")
      const filePath = join(mailsPath, file)
      const content = await readFile(filePath, "utf8")

      return {
        name: templateName,
        content,
        isPlaintext: false,
      }
    }),
  )
}

export function loadPlaintextTemplates({
  plaintextMailsPath,
  outputMode,
}: {
  plaintextMailsPath: string
  outputMode: OutputMode
}): ResultAsync<Template[], LoadPlaintextTemplatesError> {
  return ResultAsync.fromPromise(
    readPlaintextTemplates({ plaintextMailsPath, outputMode }),
    (cause): LoadPlaintextTemplatesError => ({
      kind: "loadPlaintextTemplatesFailed",
      plaintextMailsPath,
      cause,
    }),
  )
}

async function readPlaintextTemplates({
  plaintextMailsPath,
  outputMode,
}: {
  plaintextMailsPath: string
  outputMode: OutputMode
}): Promise<Template[]> {
  const files = await readdir(plaintextMailsPath)

  const plaintextFiles =
    outputMode === "kratos"
      ? files.filter(file => file.endsWith(".plaintext.gotmpl"))
      : files.filter(file => file.endsWith(".txt.cshtml"))

  return Promise.all(
    plaintextFiles.map(async file => {
      const templateName =
        outputMode === "kratos" ? file.replace(/\.plaintext\.gotmpl$/, "") : file.replace(/\.txt\.cshtml$/, "")
      const filePath = join(plaintextMailsPath, file)
      const content = await readFile(filePath, "utf8")

      return {
        name: templateName,
        content,
        isPlaintext: true,
      }
    }),
  )
}
