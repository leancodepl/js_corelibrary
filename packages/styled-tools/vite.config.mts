/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react"
import * as path from "node:path"
/// <reference types='vitest' />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: "../../node_modules/.vite/packages/styled-tools",
  plugins: [react(), dts({ entryRoot: "src", tsconfigPath: path.join(import.meta.dirname, "tsconfig.lib.json") })],
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: "src/index.ts",
      name: "@leancodepl/styled-tools",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
  test: {
    name: "@leancodepl/styled-tools",
    watch: false,
    globals: true,
    environment: "jsdom",
    passWithNoTests: true,
    include: ["{src,__tests__}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      provider: "v8" as const,
    },
  },
}))
