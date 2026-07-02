import * as path from "node:path"
/// <reference types='vitest' />
import { defineConfig, type Plugin } from "vite"
import dts from "vite-plugin-dts"

const importMetaEnvPlaceholder = "__preserved_import_meta_env__"
const importMetaEnvCode = "import.meta.env"

// This package's whole purpose is to defer `import.meta.env` lookups to the
// consumer's Vite build. Vite resolves `import.meta.env` at build time (in lib
// mode it inlines a frozen env snapshot, with no opt-out), and the consumer's
// Vite detects the expression textually, so the literal `import.meta.env` must
// survive into dist verbatim. Hide it behind a placeholder while the build
// runs, restore it in the emitted chunks, and fail the build if it's missing.
function preserveImportMetaEnv(): Plugin {
  return {
    name: "preserve-import-meta-env",
    enforce: "pre",
    apply: "build",
    transform(code) {
      if (!code.includes(importMetaEnvCode)) return
      return { code: code.replaceAll(importMetaEnvCode, importMetaEnvPlaceholder), map: null }
    },
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "chunk") continue
        chunk.code = chunk.code.replaceAll(importMetaEnvPlaceholder, importMetaEnvCode)
        if (!chunk.code.includes(importMetaEnvCode)) {
          this.error(`${chunk.fileName} must contain a literal \`${importMetaEnvCode}\``)
        }
      }
    },
  }
}

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: "../../node_modules/.vite/packages/config",
  plugins: [
    dts({ entryRoot: "src", tsconfigPath: path.join(import.meta.dirname, "tsconfig.lib.json") }),
    preserveImportMetaEnv(),
  ],
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: "src/index.ts",
      name: "@leancodepl/config",
      fileName: "index",
      // No UMD build: `import.meta` is a syntax error in CJS, so the env access
      // cannot be expressed there. The exports map only ever exposed the ESM file.
      formats: ["es" as const],
    },
    rollupOptions: {
      external: [],
    },
  },
  test: {
    name: "@leancodepl/config",
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
