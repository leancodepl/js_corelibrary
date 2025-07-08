const mjml = require("mjml")

export interface MjmlCompileOptions {
    keepComments?: boolean
    beautify?: boolean
    minify?: boolean
    validationLevel?: "skip" | "soft" | "strict"
}

export interface MjmlCompileResult {
    html: string
    errors: Array<{
        line: number
        message: string
        tagName: string
    }>
}

/**
 * Compiles an MJML template to HTML
 * @param mjmlContent - The MJML template content
 * @param options - Compilation options
 * @returns Compiled HTML and any errors
 */
export function compileMjml(mjmlContent: string, options: MjmlCompileOptions = {}): MjmlCompileResult {
    const defaultOptions: MjmlCompileOptions = {
        keepComments: false,
        beautify: false,
        minify: false,
        validationLevel: "soft",
        ...options,
    }

    try {
        const result = mjml(mjmlContent, defaultOptions)

        return {
            html: result.html,
            errors: result.errors || [],
        }
    } catch (error) {
        throw new Error(`MJML compilation failed: ${error}`)
    }
}

/**
 * Compiles multiple MJML templates to HTML
 * @param templates - Object containing template names and their MJML content
 * @param options - Compilation options
 * @returns Object containing compiled HTML templates and any errors
 */
export function compileMjmlTemplates(
    templates: { [name: string]: string },
    options: MjmlCompileOptions = {},
): { [name: string]: MjmlCompileResult } {
    const compiledTemplates: { [name: string]: MjmlCompileResult } = {}

    for (const [name, mjmlContent] of Object.entries(templates)) {
        compiledTemplates[name] = compileMjml(mjmlContent, options)
    }

    return compiledTemplates
}
