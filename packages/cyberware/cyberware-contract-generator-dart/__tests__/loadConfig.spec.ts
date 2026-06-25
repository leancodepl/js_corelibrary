import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, beforeEach } from "vitest"
import { z } from "zod"
import { cyberwareContractGeneratorDartConfigSchema } from "../src/config"
import { loadConfig, resolveOutputDir } from "../src/loadConfig"

// z.custom on the schema field performs no runtime validation, so parsing yields
// a correctly-typed config without any cast.
function mkConfig(outputDir: string) {
  return cyberwareContractGeneratorDartConfigSchema.parse({ schema: z.object({}), outputDir })
}

describe("resolveOutputDir", () => {
  it("returns an absolute outputDir unchanged", () => {
    const abs = path.resolve("/some/absolute/output")
    expect(resolveOutputDir(mkConfig(abs), "/config/dir")).toBe(abs)
  })

  it("resolves a relative outputDir against the config dir", () => {
    expect(resolveOutputDir(mkConfig("generated"), "/config/dir")).toBe(path.resolve("/config/dir", "generated"))
  })

  it("resolves a parent-relative outputDir against the config dir", () => {
    expect(resolveOutputDir(mkConfig("../out"), "/config/dir")).toBe(path.resolve("/config/dir", "../out"))
  })
})

describe("loadConfig", () => {
  // Config files are loaded via dynamic import, so they must live inside the
  // package directory where the workspace node_modules (and thus their imports)
  // are resolvable. The schema field is validated with z.custom and accepts any
  // value, so the test configs avoid importing zod and just supply a marker.
  const fixturesDir = path.join(__dirname, ".tmp-config-fixtures")
  const written: string[] = []

  function writeConfig(name: string, contents: string): string {
    const configPath = path.join(fixturesDir, name)
    fs.writeFileSync(configPath, contents, "utf8")
    written.push(configPath)
    return configPath
  }

  beforeEach(() => {
    fs.mkdirSync(fixturesDir, { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(fixturesDir, { recursive: true, force: true })
    written.length = 0
  })

  it("loads a config from an explicit path and resolves the output dir relative to it", async () => {
    const configPath = writeConfig(
      "relative.config.mjs",
      `export default { schema: { marker: true }, outputDir: "generated" }\n`,
    )

    const { config, outputDir } = await loadConfig(configPath)

    expect(config.outputDir).toBe("generated")
    expect(outputDir).toBe(path.resolve(fixturesDir, "generated"))
  })

  it("keeps an absolute outputDir from the config", async () => {
    const absOut = path.join(os.tmpdir(), "absolute-out")
    const configPath = writeConfig(
      "absolute.config.mjs",
      `export default { schema: { marker: true }, outputDir: ${JSON.stringify(absOut)} }\n`,
    )

    const { outputDir } = await loadConfig(configPath)

    expect(outputDir).toBe(absOut)
  })

  it("throws a descriptive error when no config can be found", async () => {
    const missing = path.join(fixturesDir, "does-not-exist.config.mjs")

    await expect(loadConfig(missing)).rejects.toThrow()
  })

  it("throws when the loaded config fails schema validation", async () => {
    const configPath = writeConfig("invalid.config.mjs", `export default { schema: { marker: true } }\n`)

    await expect(loadConfig(configPath)).rejects.toThrow()
  })
})
