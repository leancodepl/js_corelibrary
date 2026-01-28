import { assertDefined } from "../src/lib/assertDefined"

describe("assertDefined", () => {
  it("doesn't throw when value is defined", () => {
    expect(() => assertDefined("value")).not.toThrow()
  })

  it("throws when value is undefined", () => {
    expect(() => assertDefined(undefined)).toThrow()
  })
})
