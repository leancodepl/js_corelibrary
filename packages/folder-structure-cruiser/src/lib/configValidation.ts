import { z } from "zod"

export const regexPatternSchema = z.string().refine(
  value => {
    try {
      new RegExp(value)
      return true
    } catch {
      return false
    }
  },
  {
    error: issue => {
      let detail = ""
      try {
        new RegExp(issue.input as string)
      } catch (error) {
        detail = error instanceof Error ? error.message : String(error)
      }
      return `pattern ${JSON.stringify(issue.input)} is not a valid regular expression: ${detail}`
    },
  },
)
