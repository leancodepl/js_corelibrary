import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, beforeEach, vi } from "vitest"
import { z } from "zod"
import { methodDef, mkZodContractSchema } from "@leancodepl/cyberware-contract"
import { cyberwareContractGeneratorDartConfigSchema } from "../src/config"
import { generate } from "../src/generate"

function makeContractSchema() {
  return mkZodContractSchema({
    hostMethods: {
      navigateTo: methodDef({ params: z.object({ path: z.string() }) }),
      ping: methodDef(),
    },
    remoteMethods: {
      getCurrentPath: methodDef({ returns: z.string() }),
      refresh: methodDef(),
    },
    remoteParams: { userId: z.string() },
  })
}

function read(dir: string, file: string) {
  return fs.readFileSync(path.join(dir, file), "utf8")
}

describe("generate", () => {
  let tmpDir: string
  let stdoutSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dart-generate-"))
    stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true)
  })

  afterEach(() => {
    stdoutSpy.mockRestore()
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it("writes exactly the three expected Dart files", async () => {
    await generate({ schema: makeContractSchema() }, tmpDir)

    expect(fs.readdirSync(tmpDir).toSorted()).toEqual(["connect_to_host.dart", "contract.dart", "types.dart"])
  })

  it("creates the output directory when it does not exist", async () => {
    const nested = path.join(tmpDir, "deeply", "nested", "out")
    expect(fs.existsSync(nested)).toBe(false)

    await generate({ schema: makeContractSchema() }, nested)

    expect(fs.existsSync(nested)).toBe(true)
    expect(fs.existsSync(path.join(nested, "contract.dart"))).toBe(true)
  })

  it("reuses an already-existing output directory", async () => {
    await expect(generate({ schema: makeContractSchema() }, tmpDir)).resolves.toBeUndefined()
    expect(fs.existsSync(path.join(tmpDir, "types.dart"))).toBe(true)
  })

  it("prints where the Dart was generated", async () => {
    await generate({ schema: makeContractSchema() }, tmpDir)

    expect(stdoutSpy).toHaveBeenCalledWith(`Dart generated in ${tmpDir}\n`)
  })

  it("emits an extension type for a params object with pascal-cased section prefix", async () => {
    await generate({ schema: makeContractSchema() }, tmpDir)
    const contract = read(tmpDir, "contract.dart")

    expect(contract).toContain("extension type HostNavigateToParams._(JSObject _) implements JSObject {")
    expect(contract).toContain("String path,")
    expect(contract).toContain("external String path;")
  })

  it("names result typedefs from the method and maps return types to Dart", async () => {
    await generate({ schema: makeContractSchema() }, tmpDir)
    const contract = read(tmpDir, "contract.dart")

    // String return becomes a String typedef.
    expect(contract).toContain("typedef RemoteGetCurrentPathResult = String;")
    // Method with no returns becomes a void typedef.
    expect(contract).toContain("typedef HostNavigateToResult = void;")
    expect(contract).toContain("typedef RemoteRefreshResult = void;")
    expect(contract).toContain("typedef HostPingResult = void;")
  })

  it("renders RemoteParams as an extension type with a getter per param", async () => {
    await generate({ schema: makeContractSchema() }, tmpDir)
    const contract = read(tmpDir, "contract.dart")
    const types = read(tmpDir, "types.dart")

    expect(contract).toContain("extension type RemoteParams._(JSObject _) implements JSObject {")
    expect(types).toContain("String get userId => base.UrlParamsBase.params['userId']!;")
  })

  it("declares the abstract RemoteMethodsBase with params only for methods that have them", async () => {
    await generate({ schema: makeContractSchema() }, tmpDir)
    const types = read(tmpDir, "types.dart")

    // getCurrentPath has no params object -> no parameter in the signature.
    expect(types).toContain("Future<RemoteGetCurrentPathResult> getCurrentPath();")
    expect(types).toContain("Future<RemoteRefreshResult> refresh();")
  })

  it("wires a value-returning remote method through promiseValue with toJS conversion", async () => {
    await generate({ schema: makeContractSchema() }, tmpDir)
    const types = read(tmpDir, "types.dart")

    expect(types).toContain(
      "getCurrentPath: (() => promiseValue(methods.getCurrentPath().then((s) => s.toJS))).toJS,",
    )
  })

  it("generates the connect_to_host helper referencing the host and remote method types", async () => {
    await generate({ schema: makeContractSchema() }, tmpDir)
    const connect = read(tmpDir, "connect_to_host.dart")

    expect(connect).toContain("Future<ConnectToHostResult<HostMethods>> connectToHost(RemoteMethodsBase methods) async {")
    expect(connect).toContain("connectToHostRaw<JSHostMethods>(JSRemoteMethods.fromDart(methods))")
    expect(connect).toContain("raw.toTyped(HostMethods.new);")
  })

  it("emits the JSHostMethods external method with its params type", async () => {
    await generate({ schema: makeContractSchema() }, tmpDir)
    const types = read(tmpDir, "types.dart")

    expect(types).toContain("external JSPromise navigateTo(HostNavigateToParams params);")
    expect(types).toContain(
      "Future<HostNavigateToResult> navigateTo(HostNavigateToParams params) => _jsMethods.navigateTo(params).toDart;",
    )
  })

  it("prefixes the generated files with the do-not-edit banner", async () => {
    await generate({ schema: makeContractSchema() }, tmpDir)

    for (const file of ["contract.dart", "types.dart", "connect_to_host.dart"]) {
      expect(read(tmpDir, file).startsWith("// Generated from JSON Schema. Do not edit by hand.")).toBe(true)
    }
  })

  it("throws when the schema is not a valid contract root", async () => {
    // z.custom on the schema field performs no runtime check, so this lets us
    // feed a structurally-wrong schema through the public config type without a cast.
    const { schema } = cyberwareContractGeneratorDartConfigSchema.parse({
      schema: z.object({ foo: z.string() }),
      outputDir: tmpDir,
    })

    await expect(generate({ schema }, tmpDir)).rejects.toThrow(
      "Root type not found or is not a valid contract root",
    )
  })
})
