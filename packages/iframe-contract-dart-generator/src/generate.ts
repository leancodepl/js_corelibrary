import fs from "node:fs"
import path from "node:path"
import { InputData, JSONSchemaInput, quicktypeMultiFile } from "quicktype-core"
import { z } from "zod"
import { IframeContractDartGeneratorConfig } from "./config"
import { DartExtensionTypesTargetLanguage } from "./dart/language"

function buildJsonSchema(schema: z.ZodType): string {
  const jsonSchema = z.toJSONSchema(schema, { unrepresentable: "any", reused: "ref", target: "draft-7" })

  return JSON.stringify(jsonSchema)
}

async function runQuicktype(schemaJson: string, outputDir: string): Promise<void> {
  const inputData = new InputData()
  const schemaInput = new JSONSchemaInput(undefined)
  await schemaInput.addSource({ name: "contract", schema: schemaJson })

  inputData.addInput(schemaInput)

  const result = await quicktypeMultiFile({
    lang: new DartExtensionTypesTargetLanguage(),
    inputData,
  })

  for (const [fileName, { lines }] of result) {
    fs.writeFileSync(path.join(outputDir, fileName), lines.join("\n"), "utf8")
  }
}

/**
 * Generates Dart extension type files from an iframe contract schema. Produces three files in the
 * output directory: `contract.dart`, `types.dart`, and `connect_to_host.dart`.
 *
 * @param config - Configuration containing the Zod contract schema
 * @param outputDir - Absolute or relative path to the directory where Dart files will be written
 *
 * @example
 * ```typescript
 * import { generate } from "@leancodepl/iframe-contract-dart-generator";
 * import { mkZodContractSchema, methodDef } from "@leancodepl/cyberware-contract";
 * import { z } from "zod";
 *
 * const schema = mkZodContractSchema({
 *   hostMethods: {
 *     navigateTo: methodDef({ params: z.object({ path: z.string() }) }),
 *   },
 *   remoteMethods: {
 *     getCurrentPath: methodDef({ returns: z.string() }),
 *   },
 *   remoteParams: { userId: z.string() },
 * });
 *
 * await generate({ schema }, "./lib/generated");
 * ```
 */
export async function generate(config: Pick<IframeContractDartGeneratorConfig, "schema">, outputDir: string) {
  const schemaJson = buildJsonSchema(config.schema)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  await runQuicktype(schemaJson, outputDir)

  process.stdout.write(`Dart generated in ${outputDir}\n`)
}
