import type { ServerResponse } from "node:http"
import type { Connect, ResolvedConfig, ViteDevServer } from "vite"
import favicons, { FaviconResponse } from "favicons"
// tsconfig.spec.json resolves modules with "nodenext", which requires the file
// extension, but the import plugin assumes bundler resolution and wants ".".
// eslint-disable-next-line import/no-useless-path-segments
import { ViteFaviconsPlugin } from "./index.js"

// vitest globals are enabled, so describe/it/expect/vi come from the ambient env.
type Mock = ReturnType<typeof vi.fn>

vi.mock("favicons", () => ({ default: vi.fn() }))

const faviconsMock = favicons as unknown as Mock

const faviconResponse: FaviconResponse = {
  images: [{ name: "favicon.ico", contents: Buffer.from("ico-bytes") }],
  files: [{ name: "manifest.webmanifest", contents: "{}" }],
  html: ['<link rel="icon" href="/favicon.ico">', '<link rel="manifest" href="/manifest.webmanifest">'],
}

function resolveConfig(plugin: ReturnType<typeof ViteFaviconsPlugin>, command: ResolvedConfig["command"]) {
  const hook = plugin.configResolved
  const handler = typeof hook === "function" ? hook : hook?.handler
  return handler?.call(undefined as never, { command } as ResolvedConfig)
}

function runBuildStart(plugin: ReturnType<typeof ViteFaviconsPlugin>, ctx: unknown) {
  const hook = plugin.buildStart
  const handler = typeof hook === "function" ? hook : hook?.handler
  return handler?.call(ctx as never, {} as never)
}

function transformIndexHtml(plugin: ReturnType<typeof ViteFaviconsPlugin>, ctx: unknown) {
  const hook = plugin.transformIndexHtml
  const handler = typeof hook === "function" ? hook : hook?.handler
  return handler?.call(undefined as never, "", ctx as never)
}

function runGenerateBundle(plugin: ReturnType<typeof ViteFaviconsPlugin>, ctx: unknown, bundle: unknown) {
  const hook = plugin.generateBundle
  const handler = typeof hook === "function" ? hook : hook?.handler
  return handler?.call(ctx as never, {} as never, bundle as never, false)
}

function captureMiddleware(plugin: ReturnType<typeof ViteFaviconsPlugin>) {
  let middleware: Connect.NextHandleFunction | undefined
  const hook = plugin.configureServer
  const handler = typeof hook === "function" ? hook : hook?.handler
  handler?.call(
    undefined as never,
    {
      middlewares: { use: (fn: Connect.NextHandleFunction) => (middleware = fn) },
    } as unknown as ViteDevServer,
  )
  return middleware
}

beforeEach(() => {
  faviconsMock.mockReset()
  faviconsMock.mockResolvedValue(faviconResponse)
})

describe("ViteFaviconsPlugin", () => {
  it("does not restrict itself to build only, so it also runs during dev", () => {
    expect(ViteFaviconsPlugin().apply).toBeUndefined()
  })

  describe("dev (serve)", () => {
    it("generates favicons without emitting bundle assets", async () => {
      const plugin = ViteFaviconsPlugin({ logo: "logo.svg" })
      resolveConfig(plugin, "serve")

      const emitFile = vi.fn()
      await runBuildStart(plugin, { addWatchFile: vi.fn(), emitFile })

      expect(faviconsMock).toHaveBeenCalledOnce()
      expect(emitFile).not.toHaveBeenCalled()
    })

    it("serves generated assets from memory through the dev middleware", async () => {
      const plugin = ViteFaviconsPlugin({ logo: "logo.svg" })
      resolveConfig(plugin, "serve")
      await runBuildStart(plugin, { addWatchFile: vi.fn(), emitFile: vi.fn() })

      const middleware = captureMiddleware(plugin)

      const res = { setHeader: vi.fn(), end: vi.fn() } as unknown as ServerResponse
      const next = vi.fn()
      middleware?.({ url: "/favicon.ico?v=1" } as Connect.IncomingMessage, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.statusCode).toBe(200)
      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "image/x-icon")
      expect(res.setHeader).toHaveBeenCalledWith("Cache-Control", "no-cache")
      expect(res.end).toHaveBeenCalledWith(Buffer.from("ico-bytes"))
    })

    it("matches the asset path exactly, so it does not shadow lookalike nested routes", async () => {
      const plugin = ViteFaviconsPlugin({ logo: "logo.svg" })
      resolveConfig(plugin, "serve")
      await runBuildStart(plugin, { addWatchFile: vi.fn(), emitFile: vi.fn() })

      const middleware = captureMiddleware(plugin)

      const res = { setHeader: vi.fn(), end: vi.fn() } as unknown as ServerResponse
      const next = vi.fn()
      // A user resource that merely ends in the favicon name must pass through.
      middleware?.({ url: "/uploads/favicon.ico" } as Connect.IncomingMessage, res, next)

      expect(next).toHaveBeenCalledOnce()
      expect(res.end).not.toHaveBeenCalled()
    })

    it("passes unrelated requests through untouched", async () => {
      const plugin = ViteFaviconsPlugin({ logo: "logo.svg" })
      resolveConfig(plugin, "serve")
      await runBuildStart(plugin, { addWatchFile: vi.fn(), emitFile: vi.fn() })

      const middleware = captureMiddleware(plugin)

      const res = { setHeader: vi.fn(), end: vi.fn() } as unknown as ServerResponse
      const next = vi.fn()
      middleware?.({ url: "/index.html" } as Connect.IncomingMessage, res, next)

      expect(next).toHaveBeenCalledOnce()
      expect(res.end).not.toHaveBeenCalled()
    })

    it("injects tags pointing at the in-memory asset paths", async () => {
      const plugin = ViteFaviconsPlugin({ logo: "logo.svg" })
      resolveConfig(plugin, "serve")
      await runBuildStart(plugin, { addWatchFile: vi.fn(), emitFile: vi.fn() })

      const tags = await transformIndexHtml(plugin, {})

      expect(tags).toEqual([
        { tag: "link", attrs: { rel: "icon", href: "/favicon.ico" } },
        { tag: "link", attrs: { rel: "manifest", href: "/manifest.webmanifest" } },
      ])
    })
  })

  describe("build", () => {
    it("emits every generated asset into the bundle", async () => {
      const plugin = ViteFaviconsPlugin({ logo: "logo.svg" })
      resolveConfig(plugin, "build")

      const emitFile = vi.fn()
      await runBuildStart(plugin, { addWatchFile: vi.fn(), emitFile })

      expect(emitFile).toHaveBeenCalledWith({
        type: "asset",
        name: "favicon.ico",
        source: Buffer.from("ico-bytes"),
      })
      expect(emitFile).toHaveBeenCalledWith({
        type: "asset",
        name: "manifest.webmanifest",
        source: "{}",
      })
    })

    it("rewrites injected tags to the hashed bundle file names", async () => {
      const plugin = ViteFaviconsPlugin({ logo: "logo.svg" })
      resolveConfig(plugin, "build")
      await runBuildStart(plugin, { addWatchFile: vi.fn(), emitFile: vi.fn() })

      const tags = await transformIndexHtml(plugin, {
        bundle: {
          "favicon.ico": { type: "asset", names: ["favicon.ico"], fileName: "assets/favicon-abc123.ico" },
          "manifest.webmanifest": {
            type: "asset",
            names: ["manifest.webmanifest"],
            fileName: "assets/manifest-def456.webmanifest",
          },
        },
      })

      expect(tags).toEqual([
        { tag: "link", attrs: { rel: "icon", href: "/assets/favicon-abc123.ico" } },
        { tag: "link", attrs: { rel: "manifest", href: "/assets/manifest-def456.webmanifest" } },
      ])
    })

    it("rewrites icon references inside generated manifest/config files to hashed names", async () => {
      // favicons bakes pre-hash icon paths into the manifest/config contents;
      // those must be rewritten to the hashed asset names, or the built
      // manifests point at files that no longer exist.
      faviconsMock.mockResolvedValue({
        images: [
          { name: "favicon-16x16.png", contents: Buffer.from("16") },
          // Two names sharing a stem: the shorter must not corrupt the longer.
          { name: "mstile-70x70.png", contents: Buffer.from("70") },
          { name: "mstile-70x70@2x.png", contents: Buffer.from("70-2x") },
        ],
        files: [
          {
            name: "manifest.webmanifest",
            contents: JSON.stringify({
              icons: [{ src: "/favicon-16x16.png" }, { src: "/mstile-70x70.png" }, { src: "/mstile-70x70@2x.png" }],
            }),
          },
        ],
        html: [],
      } satisfies FaviconResponse)

      const plugin = ViteFaviconsPlugin({ logo: "logo.svg" })
      resolveConfig(plugin, "build")
      await runBuildStart(plugin, { addWatchFile: vi.fn(), emitFile: vi.fn() })

      // The bundle exposes each emitted asset by its hashed name plus its
      // original name(s), which is how the plugin resolves the mapping.
      const bundle = {
        "assets/favicon-16x16-aaa.png": {
          type: "asset",
          names: ["favicon-16x16.png"],
          fileName: "assets/favicon-16x16-aaa.png",
        },
        "assets/mstile-70x70-bbb.png": {
          type: "asset",
          names: ["mstile-70x70.png"],
          fileName: "assets/mstile-70x70-bbb.png",
        },
        "assets/mstile-70x70@2x-ccc.png": {
          type: "asset",
          names: ["mstile-70x70@2x.png"],
          fileName: "assets/mstile-70x70@2x-ccc.png",
        },
        "assets/manifest-ddd.webmanifest": {
          type: "asset",
          names: ["manifest.webmanifest"],
          fileName: "assets/manifest-ddd.webmanifest",
          source: JSON.stringify({
            icons: [{ src: "/favicon-16x16.png" }, { src: "/mstile-70x70.png" }, { src: "/mstile-70x70@2x.png" }],
          }),
        },
      }
      runGenerateBundle(plugin, undefined, bundle)

      expect(JSON.parse(bundle["assets/manifest-ddd.webmanifest"].source)).toEqual({
        icons: [
          { src: "/assets/favicon-16x16-aaa.png" },
          { src: "/assets/mstile-70x70-bbb.png" },
          { src: "/assets/mstile-70x70@2x-ccc.png" },
        ],
      })
    })
  })
})
