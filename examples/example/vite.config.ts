import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin"
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
/// <reference types='vitest' />
import { defineConfig } from "vite"

export default defineConfig(() => ({
    root: __dirname,
    cacheDir: "../../node_modules/.vite/examples/example",
    server: { port: 4200, host: "localhost", allowedHosts: ["local.lncd.pl", "host.local.lncd.pl"] },
    preview: { port: 4300, host: "localhost" },
    plugins: [TanStackRouterVite(), react(), nxViteTsPaths(), nxCopyAssetsPlugin(["*.md"])],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
        outDir: "../../dist/examples/example",
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: { transformMixedEsModules: true },
    },
}))
