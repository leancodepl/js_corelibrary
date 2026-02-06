/* eslint-disable import/no-extraneous-dependencies */
import * as path from "node:path"
/// <reference types='vitest' />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: "../../node_modules/.vite/packages/nx-plugins",
  plugins: [dts({ entryRoot: "src", tsconfigPath: path.join(import.meta.dirname, "tsconfig.lib.json") })],
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: {
        index: "src/index.ts",
        intl: "src/intl.ts",
        proxy: "src/proxy.ts",
        contracts: "src/contracts.ts",
      },
    },
    rollupOptions: {
      external: ["@nx/devkit", "node:path", "node:fs", "node:child_process", /^node:/],
    },
  },
  test: {
    name: "@leancodepl/nx-plugins",
    watch: false,
    globals: true,
    environment: "node",
    passWithNoTests: true,
    include: ["{src,__tests__}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      provider: "v8" as const,
    },
  },
}))
