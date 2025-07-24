import { readdir, readFile } from "fs/promises"
import { basename, extname, join } from "path"
import { OutputMode } from "./config"
import { Template } from "./processTemplate"

export async function loadMjmlTemplates(mailsPath: string): Promise<Template[]> {
  try {
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
  } catch (error) {
    throw new Error(`Failed to load templates: ${error}`)
  }
}

export async function loadPlaintextTemplates({
  plaintextMailsPath,
  outputMode,
}: {
  plaintextMailsPath: string
  outputMode: OutputMode
}): Promise<Template[]> {
  try {
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
  } catch (error) {
    throw new Error(`Failed to load plaintext templates: ${error}`)
  }
}
