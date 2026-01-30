/* eslint-disable import/no-extraneous-dependencies */
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin"
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin"
/// <reference types='vitest' />
import { defineConfig } from "vite"

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: "../../node_modules/.vite/packages/testlib",
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(["*.md"])],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  test: {
    name: "testlib",
    watch: false,
    globals: true,
    environment: "node",
    include: ["{src,__tests__}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../coverage/packages/testlib",
      provider: "v8" as const,
    },
  },
}))
