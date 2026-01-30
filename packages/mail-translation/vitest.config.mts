/* eslint-disable import/no-extraneous-dependencies */
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin"
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin"
import { defineConfig } from "vitest/config"

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/packages/mail-translation",
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(["*.md"])],
  test: {
    name: "mail-translation",
    watch: false,
    globals: true,
    environment: "node",
    include: ["{src,__tests__}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    setupFiles: ["./__tests__/setup.ts"],
    passWithNoTests: true,
    coverage: {
      reportsDirectory: "../../coverage/packages/mail-translation",
      provider: "v8" as const,
    },
  },
}))
