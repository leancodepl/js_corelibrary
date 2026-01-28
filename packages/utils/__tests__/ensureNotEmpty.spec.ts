import { ensureNotEmpty } from "../src/lib/ensureNotEmpty"

describe("ensureNotEmpty", () => {
  it("returns the same value when it is neither null nor undefined", () => {
    expect(ensureNotEmpty("value")).toBe("value")
  })

  it("throws error when value is null or undefined", () => {
    expect(() => ensureNotEmpty(undefined)).toThrow()
  })
})
