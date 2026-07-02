import { execSync } from "node:child_process"
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import * as path from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "vite"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

// These tests validate the PUBLISHED artifact, not the source. The whole point
// of `@leancodepl/config` is to defer `import.meta.env` resolution to the
// consumer's Vite build, so the literal expression must survive into `dist` and
// be textually replaced by a real consumer pipeline. The source-level specs in
// `src/index.spec.ts` cannot catch this: they import from source and never
// exercise the built output through Vite. Historical regressions this guards:
//   - variant A (9.7.3-10.2.x): lib mode baked a frozen build-time snapshot into
//     dist -> the consumer always sees `undefined`.
//   - variant B (10.3.x-10.5.1): `const importMeta = import.meta` -> in the
//     consumer this stays a bare `import.meta` (not textually replaced) whose
//     `.env` is undefined -> `TypeError`.

const testDir = import.meta.dirname
const configPkgRoot = path.resolve(testDir, "..")
const repoRoot = path.resolve(testDir, "../../..")
const distEntry = path.join(configPkgRoot, "dist", "index.js")

const expectedValue = "some-expected-value"

let tmpDirs: string[] = []

beforeAll(() => {
  // `nx test config` builds dist first (project.json wires test -> dependsOn
  // build). This fallback keeps the spec runnable via a bare `vitest` too.
  if (!existsSync(distEntry)) {
    execSync("npx nx build config", { cwd: repoRoot, stdio: "inherit" })
  }
}, 180_000)

afterAll(() => {
  for (const dir of tmpDirs) {
    rmSync(dir, { recursive: true, force: true })
  }
  tmpDirs = []
})

describe("built dist (cheap static gate)", () => {
  it("preserves a literal `import.meta.env` in the emitted ESM", () => {
    const code = readFileSync(distEntry, "utf8")

    // variant A leaves no literal `import.meta.env` (it is replaced by an
    // inlined/frozen snapshot at library build time).
    expect(code).toContain("import.meta.env")
  })

  it("does not stash `import.meta` into a local binding (variant B shape)", () => {
    const code = readFileSync(distEntry, "utf8")

    // `const importMeta = import.meta` (or any `= import.meta` not immediately
    // followed by `.env`) is the variant B shape that breaks consumer-side
    // textual replacement.
    expect(code).not.toMatch(/=\s*import\.meta\b(?!\.env)/)
  })
})

describe("built dist consumed through a real Vite build", () => {
  it("resolves the consumer's env var at the consumer's build time", async () => {
    const fixtureDir = mkdtempSync(path.join(tmpdir(), "config-dist-consumer-"))
    tmpDirs.push(fixtureDir)

    // A fixture that behaves like a downstream app depending on the built
    // package. Importing the built `dist` by absolute path guarantees Vite
    // bundles it (rather than externalising a bare specifier), so the
    // consumer's pipeline is the thing that must textually replace
    // `import.meta.env` -- exactly the real-world path.
    writeFileSync(
      path.join(fixtureDir, "package.json"),
      JSON.stringify({ name: "config-dist-consumer-fixture", version: "0.0.0", type: "module" }),
    )
    writeFileSync(path.join(fixtureDir, ".env"), `VITE_FOO=${expectedValue}\n`)
    writeFileSync(
      path.join(fixtureDir, "entry.js"),
      [
        `import { mkGetInjectedConfig } from ${JSON.stringify(distEntry)}`,
        "const { getInjectedConfig } = mkGetInjectedConfig()",
        "export const result = getInjectedConfig('FOO')",
        "",
      ].join("\n"),
    )

    await build({
      root: fixtureDir,
      configFile: false,
      logLevel: "silent",
      build: {
        outDir: path.join(fixtureDir, "out"),
        emptyOutDir: true,
        minify: false,
        lib: {
          entry: path.join(fixtureDir, "entry.js"),
          formats: ["es"],
          fileName: () => "consumer.js",
        },
        rollupOptions: { external: [] },
      },
    })

    const outDir = path.join(fixtureDir, "out")
    const outFile = readdirSync(outDir).find(f => f.endsWith(".js") || f.endsWith(".mjs"))
    if (!outFile) throw new Error("consumer build produced no ESM output")

    const mod = await import(pathToFileURL(path.join(outDir, outFile)).href)

    // variant A -> undefined; variant B -> a broken lookup (undefined/TypeError).
    expect(mod.result).toBe(expectedValue)
  }, 120_000)
})
