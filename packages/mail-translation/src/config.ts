import { z } from "zod/v4"

const outputModeSchema = z.enum(["kratos", "razor"])

export type OutputMode = z.infer<typeof outputModeSchema>

export const mailTranslationConfigSchema = z
    .object({
        translationsPath: z.string().optional(),
        mailsPath: z.string(),
        plaintextMailsPath: z.string().optional(),
        outputPath: z.string(),
        outputMode: outputModeSchema,
        defaultLanguage: z.string().optional(),
        languages: z.array(z.string()).optional(),
    })
    .transform(config => {
        if (!config.plaintextMailsPath) {
            config.plaintextMailsPath = config.mailsPath
        }
        return config
    })

export type MailTranslationConfig = z.infer<typeof mailTranslationConfigSchema>
