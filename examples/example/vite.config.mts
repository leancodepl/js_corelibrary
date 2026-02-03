/* eslint-disable import/no-extraneous-dependencies */
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { join } from "node:path"
/// <reference types='vitest' />
import { defineConfig } from "vite"

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/examples/example",
  server: { port: 4200, host: "localhost", allowedHosts: ["local.lncd.pl", "host.local.lncd.pl"] },
  preview: { port: 4300, host: "localhost" },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: join(__dirname, "src/routes"),
      generatedRouteTree: join(__dirname, "src/routeTree.gen.ts"),
    }),
    react(),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
  },
  test: {
    name: "example",
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
