const mjml = require("mjml")

export interface MjmlCompileOptions {
    keepComments?: boolean
    beautify?: boolean
    minify?: boolean
    validationLevel?: "skip" | "soft" | "strict"
    filePath?: string
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
        filePath: ".",
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
