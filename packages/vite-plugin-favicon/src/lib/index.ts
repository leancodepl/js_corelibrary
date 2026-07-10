import type { PluginContext } from "rollup"
import type { HtmlTagDescriptor, Plugin } from "vite"
import favicons, { FaviconOptions, FaviconResponse } from "favicons"
import path from "node:path"
import { parseFragment } from "parse5"

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
   *
   * `path` is intentionally excluded: Vite hashes and relocates the generated
   * assets, so the plugin always references them at the root and rewrites the
   * injected tags to their final bundled locations.
   */
  favicons?: Omit<Partial<FaviconOptions>, "path">
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
  let isBuild = false

  let devAssetsByPath = new Map<string, { contents: Buffer | string; contentType: string }>()

  const getDevAsset = (url: string | undefined) => {
    const requestPath = url?.split("?")[0]
    return requestPath ? devAssetsByPath.get(requestPath) : undefined
  }

  const rebuildFavicons = async (ctx: PluginContext) => {
    ctx.addWatchFile(logoPath)
    faviconResponse = await favicons(logoPath, options.favicons)

    const assets = [...faviconResponse.images, ...faviconResponse.files]

    // Generated assets are emitted into the bundle only during build; in dev
    // they are served from memory
    if (isBuild) {
      for (const { name, contents } of assets) {
        ctx.emitFile({ type: "asset", name, source: contents })
      }
    } else {
      devAssetsByPath = new Map(
        assets.map(({ name, contents }) => [`/${name}`, { contents, contentType: getContentType(name) }]),
      )
    }
  }

  return {
    name: "vite-plugin-favicon",
    configResolved(config) {
      isBuild = config.command === "build"
    },
    async buildStart() {
      await rebuildFavicons(this)
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const asset = getDevAsset(req.url)

        if (!asset) {
          next()
          return
        }

        res.statusCode = 200
        res.setHeader("Content-Type", asset.contentType)
        res.setHeader("Cache-Control", "no-cache")
        res.end(asset.contents)
      })
    },
    transformIndexHtml(_, ctx) {
      if (!options.inject || !faviconResponse) return

      const tags: HtmlTagDescriptor[] = []
      const assetFileName = Object.values(ctx.bundle ?? {}).reduce(
        (acc, v) => {
          if (v.type !== "asset") return acc
          for (const name of v.names) {
            acc[name] = v.fileName
          }
          return acc
        },
        {} as Record<string, string | undefined>,
      )

      for (const tag of faviconResponse.html) {
        const node = parseFragment(tag).childNodes[0]

        if (node && "attrs" in node) {
          tags.push({
            tag: node.tagName,
            attrs: node.attrs.reduce(
              (acc, v) => {
                const name = assetFileName[v.value.slice(1)]

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

const mimeTypesByExtension: Record<string, string> = {
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
}

const getContentType = (name: string) => mimeTypesByExtension[path.extname(name)] ?? "application/octet-stream"
