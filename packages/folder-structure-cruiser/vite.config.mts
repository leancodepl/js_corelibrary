/* eslint-disable import/no-extraneous-dependencies */
import * as path from "node:path"
/// <reference types='vitest' />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: "../../node_modules/.vite/packages/folder-structure-cruiser",
  plugins: [
    dts({ entryRoot: "src", tsconfigPath: path.join(import.meta.dirname, "tsconfig.lib.json"), pathsToAliases: false }),
  ],
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
        bin: "src/bin.ts",
      },
      name: "@leancodepl/folder-structure-cruiser",
      fileName: (format, entryName) => (format === "es" ? `${entryName}.js` : `${entryName}.cjs`),
    },
    rollupOptions: {
      external: [/^node:/, /^[^./]/],
    },
  },
  test: {
    name: "folder-structure-cruiser",
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
