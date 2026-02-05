import jsBeautify from "js-beautify"
import mjml2html from "mjml"

const { html: beautifyHtml } = jsBeautify

export interface MjmlParseError {
  line: number
  message: string
  tagName: string
}

export interface MjmlCompileResult {
  html: string
  mjmlParseErrors: MjmlParseError[]
}

export function compileMjml({ mjmlContent, filePath }: { mjmlContent: string; filePath: string }): MjmlCompileResult {
  try {
    const result = mjml2html(mjmlContent, {
      keepComments: false,
      validationLevel: "soft",
      filePath,
    })

    // js-beautify is used to format the HTML as beautify option is deprecated in mjml-core
    const html = beautifyHtml(result.html, {
      indent_size: 2,
      preserve_newlines: true,
      max_preserve_newlines: 1,
    })

    return {
      html,
      mjmlParseErrors: result.errors || [],
    }
  } catch (error) {
    throw new Error(`MJML compilation failed: ${error}`)
  }
}
