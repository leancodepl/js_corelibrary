import { assertNotEmpty } from "../src/lib/assertNotEmpty"

describe("assertNotEmpty", () => {
  it("doesn't throw when value is not empty", () => {
    expect(() => assertNotEmpty("value")).not.toThrow()
  })

  it("throws error when value is either null or undefined", () => {
    expect(() => assertNotEmpty(null)).toThrow()
    expect(() => assertNotEmpty(undefined)).toThrow()
  })
})
