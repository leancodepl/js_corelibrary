/* eslint-disable import/no-extraneous-dependencies */
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin"
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin"
import { defineConfig } from "vitest/config"

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: "../../node_modules/.vite/packages/folder-structure-cruiser",
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(["*.md"])],
  test: {
    name: "folder-structure-cruiser",
    watch: false,
    globals: true,
    environment: "node",
    include: ["{src,__tests__}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    passWithNoTests: true,
    coverage: {
      reportsDirectory: "../../coverage/packages/folder-structure-cruiser",
      provider: "v8" as const,
    },
  },
}))
