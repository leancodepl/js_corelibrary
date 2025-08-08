import favicons, { FaviconOptions, FaviconResponse } from "favicons"
import { parseFragment } from "parse5"
import path from "path"
import type { PluginContext } from "rollup"
import type { HtmlTagDescriptor, Plugin } from "vite"

export type ViteFaviconsPluginOptions = {
  /** Your source logo (Will default to )
		@default "assets/logo.png"
	 */
  logo?: string
  /** Inject html links/metadata.
		@default true
	 */
  inject?: boolean
  /** `Favicons` configuration options
   *  - [See `favicons` documentation](https://github.com/itgalaxy/favicons)
   */
  favicons?: Partial<FaviconOptions>
  /** The root of the project from which you want to load metadata
		@default process.cwd()
	 */
  projectRoot?: string
  /** prefix is delegated to Rollup/Vite (keeping for people migrating from Webpack)
   * @deprecated
   */
  prefix?: string
  /** Caching is delegated to Rollup/Vite (keeping for people migrating from Webpack)
   * @deprecated
   */
  cache?: boolean
  /** Public Path is delegated to Rollup/Vite (keeping for people migrating from Webpack)
   * @deprecated
   */
  publicPath?: string
  /** Output Path is delegated to Rollup/Vite (keeping for people migrating from Webpack)
   * @deprecated
   */
  outputPath?: string
}

type FaviconsPluginArgs = Partial<ViteFaviconsPluginOptions>

export function ViteFaviconsPlugin(options: FaviconsPluginArgs = {}): Plugin {
  options.inject ??= true
  options.projectRoot ??= process.cwd()

  const logoPath = path.resolve(options.logo ?? path.join("assets", "logo.png"))

  let faviconResponse: FaviconResponse | undefined = undefined

  const rebuildFavicons = async (ctx: PluginContext) => {
    ctx.addWatchFile(logoPath)
    faviconResponse = await favicons(logoPath, options.favicons)

    for (const { name, contents } of faviconResponse.files) {
      ctx.emitFile({ type: "asset", name, source: contents })
    }
    for (const { name, contents } of faviconResponse.images) {
      ctx.emitFile({ type: "asset", name, source: contents })
    }
  }

  return {
    name: "vite-plugin-favicon",
    apply: "build",
    async buildStart() {
      await rebuildFavicons(this)
    },
    transformIndexHtml(html, ctx) {
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
