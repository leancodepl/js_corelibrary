import { z } from "zod"
import { cyberwareContractGeneratorDartConfigSchema } from "../src/config"

describe("cyberwareContractGeneratorDartConfigSchema", () => {
  it("accepts a config with a schema and an outputDir", () => {
    const result = cyberwareContractGeneratorDartConfigSchema.safeParse({
      schema: z.object({}),
      outputDir: "./lib/generated",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.outputDir).toBe("./lib/generated")
      expect(result.data.schema).toBeInstanceOf(z.ZodType)
    }
  })

  it("rejects a config without outputDir", () => {
    const result = cyberwareContractGeneratorDartConfigSchema.safeParse({
      schema: z.object({}),
    })

    expect(result.success).toBe(false)
  })

  it("rejects a config where outputDir is not a string", () => {
    const result = cyberwareContractGeneratorDartConfigSchema.safeParse({
      schema: z.object({}),
      outputDir: 123,
    })

    expect(result.success).toBe(false)
  })

  it("ignores unknown extra keys but preserves known fields", () => {
    const result = cyberwareContractGeneratorDartConfigSchema.safeParse({
      schema: z.object({}),
      outputDir: "out",
      extra: "value",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.outputDir).toBe("out")
      expect(result.data).not.toHaveProperty("extra")
    }
  })

  it("throws on parse when the config is invalid", () => {
    expect(() => cyberwareContractGeneratorDartConfigSchema.parse({})).toThrow()
  })
})
