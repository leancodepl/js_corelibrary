import type { PluginContext } from "rollup"
import type { HtmlTagDescriptor, Plugin } from "vite"
import favicons, { FaviconOptions, FaviconResponse } from "favicons"
import { parseFragment } from "parse5"
import path from "path"

/**
 * Configuration options for the Vite favicon plugin.
 */
export type ViteFaviconsPluginOptions = {
  /** Source logo path for favicon generation.
   * @default "assets/logo.png"
   */
  logo?: string
  /** Whether to inject HTML links and metadata.
   * @default true
   */
  inject?: boolean
  /** Favicons configuration options.
   * See [favicons documentation](https://github.com/itgalaxy/favicons) for details.
   */
  favicons?: Partial<FaviconOptions>
  /** Project root directory for metadata loading.
   * @default process.cwd()
   */
  outputPath?: string
}

type FaviconsPluginArgs = Partial<ViteFaviconsPluginOptions>

/**
 * Creates a Vite plugin for generating favicons from a source logo.
 *
 * Generates various favicon formats and sizes, then injects the appropriate
 * HTML tags into the build output. Supports watching for logo changes during development.
 *
 * @param options - Configuration options for favicon generation
 * @returns Vite plugin instance
 * @example
 * ```javascript
 * // vite.config.js
 * import { ViteFaviconsPlugin } from '@leancodepl/vite-plugin-favicon'
 *
 * export default {
 *   plugins: [
 *     ViteFaviconsPlugin({
 *       logo: 'src/assets/logo.png',
 *       favicons: {
 *         appName: 'My App',
 *         appShortName: 'App',
 *         themeColor: '#ffffff'
 *       }
 *     })
 *   ]
 * }
 * ```
 */
export function ViteFaviconsPlugin(options: FaviconsPluginArgs = {}): Plugin {
  options.inject ??= true

  const logoPath = path.resolve(options.logo ?? path.join("assets", "logo.png"))

  let faviconResponse: FaviconResponse | undefined = undefined

  const rebuildFavicons = async (ctx: PluginContext) => {
    ctx.addWatchFile(logoPath)
    faviconResponse = await favicons(logoPath, options.favicons)

    for (const { name, contents } of [...faviconResponse.files, ...faviconResponse.images]) {
      ctx.emitFile({ type: "asset", name, source: contents })
    }
  }

  return {
    name: "vite-plugin-favicon",
    apply: "build",
    async buildStart() {
      await rebuildFavicons(this)
    },
    transformIndexHtml(_, ctx) {
      if (!options.inject || !faviconResponse) return

      const tags: HtmlTagDescriptor[] = []
      const assets = Object.values(ctx.bundle ?? {})

      for (const tag of faviconResponse.html) {
        const node = parseFragment(tag).childNodes[0]

        if ("attrs" in node) {
          tags.push({
            tag: node.tagName,
            attrs: node.attrs.reduce(
              (acc, v) => {
                const name = assets.find(({ name }) => name === v.value.slice(1))?.fileName

                acc[v.name] = name ? `/${name}` : v.value

                return acc
              },
              {} as Record<string, string>,
            ),
          })
        }
      }

      return tags
    },
  }
}
