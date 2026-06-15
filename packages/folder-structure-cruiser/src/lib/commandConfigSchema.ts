import { z } from "zod"
import { regexPatternSchema } from "./configValidation"

export const commandConfigSchema = z.strictObject({
  /**
   * Ignore patterns merged on top of the global `ignore` list
   */
  ignore: z.array(regexPatternSchema).optional(),
})

/** Options every command section supports. */
export type CommandConfig = z.infer<typeof commandConfigSchema>
