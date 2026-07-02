import * as path from "node:path"
import { defineConfig } from "vite"

// Vite build config for the dist-consumer fixture. Deliberately NOT named
// `vite.config.*`/`vitest.config.*`: the `@nx/vite`/`@nx/vitest` plugins infer
// Nx targets from those globs, which would turn this fixture into a phantom
// project. The spec loads this via `configFile` and only overrides `build.outDir`.
export default defineConfig({
  root: import.meta.dirname,
  logLevel: "silent",
  build: {
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: path.join(import.meta.dirname, "entry.js"),
      formats: ["es"],
      fileName: () => "consumer.js",
    },
  },
})
