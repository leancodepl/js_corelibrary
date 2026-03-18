import { z } from "zod"
import type { ContractSchemaType } from "@leancodepl/cyberware-contract"

/**
 * Validates the configuration for the Dart code generator.
 *
 * @example
 * ```typescript
 * import { iframeContractDartGeneratorConfigSchema } from "@leancodepl/cyberware-contract-generator-dart";
 *
 * const config = iframeContractDartGeneratorConfigSchema.parse({
 *   schema: myContractSchema,
 *   outputDir: "./lib/generated",
 * });
 * ```
 */
export const iframeContractDartGeneratorConfigSchema = z.object({
  schema: z.custom<z.ZodType<ContractSchemaType>>(),
  outputDir: z
    .string()
    .describe("Directory where Dart files will be written (contract.dart, types.dart, connect_to_host.dart)"),
})

/** Configuration for the Dart code generator, inferred from {@link iframeContractDartGeneratorConfigSchema}. */
export type IframeContractDartGeneratorConfig = z.infer<typeof iframeContractDartGeneratorConfigSchema>
