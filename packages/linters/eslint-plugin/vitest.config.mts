import { defineConfig } from "vitest/config"

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
    passWithNoTests: true,
    coverage: {
      reportsDirectory: "../../coverage/packages/linters/eslint-plugin",
      provider: "v8" as const,
    },
  },
}))
