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

export async function compileMjml({
  mjmlContent,
  filePath,
}: {
  mjmlContent: string
  filePath: string
}): Promise<MjmlCompileResult> {
  try {
    const result = await mjml2html(mjmlContent, {
      keepComments: false,
      validationLevel: "soft",
      // `filePath` points at the templates root; templates use base-relative
      // `mj-include` paths so partials resolve within it (mjml scopes includes to
      // `filePath`/`includePath` and denies `..` escapes).
      filePath,
      // mjml 5 disables `mj-include` by default; re-enable it to resolve shared partials.
      ignoreIncludes: false,
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
