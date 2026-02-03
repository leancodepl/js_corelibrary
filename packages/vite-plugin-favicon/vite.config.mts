/* eslint-disable import/no-extraneous-dependencies */
import * as path from "node:path"
/// <reference types='vitest' />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: "../../node_modules/.vite/packages/vite-plugin-favicon",
  plugins: [dts({ entryRoot: "src", tsconfigPath: path.join(import.meta.dirname, "tsconfig.lib.json") })],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: "src/index.ts",
      name: "@leancodepl/vite-plugin-favicon",
      fileName: "index",
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      // formats: ["es" as const],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ["vite", "favicons", "parse5", /^node:/],
    },
  },
  test: {
    name: "@leancodepl/vite-plugin-favicon",
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
