/* eslint-disable import/no-extraneous-dependencies */
/// <reference types='vitest' />
import { defineConfig } from "vite"

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: "../../node_modules/.vite/packages/linters/eslint-plugin",
  plugins: [],
  test: {
    name: "linters/eslint-plugin",
    watch: false,
    globals: true,
    environment: "node",
    include: ["{src,__tests__}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      provider: "v8" as const,
    },
  },
}))
