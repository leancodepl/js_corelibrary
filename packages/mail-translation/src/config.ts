import { z } from "zod/v4"

const outputModeSchema = z.enum(["kratos", "razor"])

export type OutputMode = z.infer<typeof outputModeSchema>

export const mailTranslationConfigSchema = z.object({
  translationsPath: z
    .string()
    .optional()
    .describe(
      "Path to directory containing translation JSON files. When omitted, templates are compiled without translations. Each JSON file should be named with the language code (e.g., en.json, pl.json).",
    ),
  mailsPath: z
    .string()
    .describe(
      "Path to directory containing MJML email templates. All .mjml files in this directory will be processed.",
    ),
  plaintextMailsPath: z
    .string()
    .optional()
    .describe(
      "Path to directory containing plaintext templates. If not specified, defaults to the same value as mailsPath. Used for generating text-only versions of emails alongside HTML versions.",
    ),
  outputPath: z
    .string()
    .describe(
      "Directory where processed templates will be saved. The tool will create this directory if it doesn't exist.",
    ),
  outputMode: outputModeSchema.describe(
    "Target templating system format: 'kratos' for Go template files compatible with Ory Kratos, 'razor' for C# Razor template files.",
  ),
  defaultLanguage: z
    .string()
    .optional()
    .describe("Default language code for templates with translations. Required when translationsPath is provided."),
  languages: z
    .array(z.string())
    .optional()
    .describe(
      "Array of language codes to process. When omitted, all languages found in translation files are automatically processed. Use this to limit output to specific languages.",
    ),
  kratosLanguageVariable: z
    .string()
    .optional()
    .describe(
      "Variable path used for language detection in Kratos templates. Defaults to '.Identity.traits.lang'. This determines how the generated template will access the user's language preference. Only used in Kratos mode.",
    ),
})

export type MailTranslationConfig = z.infer<typeof mailTranslationConfigSchema>
