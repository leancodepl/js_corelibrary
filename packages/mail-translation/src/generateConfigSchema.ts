import { writeFileSync } from "fs"
import { join } from "path"
import { z } from "zod/v4"
import { mailTranslationConfigSchema } from "./config"

const jsonSchema = z.toJSONSchema(mailTranslationConfigSchema)

const output = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "@leancodepl/mail-translation Configuration",
  description: "Schema for @leancodepl/mail-translation configuration",
  ...jsonSchema,
}

const packageRoot = join(__dirname, "..")
const outputPath = join(packageRoot, "schema.json")

writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n')
