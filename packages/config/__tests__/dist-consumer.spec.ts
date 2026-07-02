import { execSync } from "node:child_process"
import { existsSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import * as path from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "vite"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

const testDir = import.meta.dirname
const fixtureDir = path.join(testDir, "fixtures", "vite-consumer")
const distEntry = path.resolve(testDir, "..", "dist", "index.js")
const expectedValue = "some-expected-value"

let tmpDirs: string[] = []

beforeAll(() => {
  // `nx test config` builds dist first (test -> ^build). This keeps a bare
  // `vitest` run working too.
  if (!existsSync(distEntry)) {
    execSync("npx nx build config", { cwd: path.resolve(testDir, "../../.."), stdio: "inherit" })
  }
}, 180_000)

afterAll(() => {
  for (const dir of tmpDirs) {
    rmSync(dir, { recursive: true, force: true })
  }
  tmpDirs = []
})

describe("built dist consumed through a real Vite build", () => {
  it("resolves the consumer's env var at the consumer's build time", async () => {
    const outDir = mkdtempSync(path.join(tmpdir(), "config-dist-consumer-"))
    tmpDirs.push(outDir)

    // Real consumer pipeline: builds the fixture (which imports the built
    // `@leancodepl/config` by name) and only redirects output to a temp dir.
    await build({
      configFile: path.join(fixtureDir, "build-config.ts"),
      build: { outDir },
    })

    const mod = await import(pathToFileURL(path.join(outDir, "consumer.js")).href)

    expect(mod.result).toBe(expectedValue)
  }, 120_000)
})
