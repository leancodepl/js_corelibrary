import { toLowerFirst, toUpperFirst } from "../src"

describe("toLowerFirst", () => {
  it("handles empty string", () => {
    expect(toLowerFirst("")).toBe("")
  })

  it("handles non empty strings", () => {
    expect(toLowerFirst("A")).toBe("a")
    expect(toLowerFirst("a")).toBe("a")

    expect(toLowerFirst("Aba")).toBe("aba")
    expect(toLowerFirst("ABA")).toBe("aBA")
    expect(toLowerFirst("aBA")).toBe("aBA")
  })
})

describe("toUpperFirst", () => {
  it("handles empty string", () => {
    expect(toUpperFirst("")).toBe("")
  })

  it("handles non empty strings", () => {
    expect(toUpperFirst("A")).toBe("A")
    expect(toUpperFirst("a")).toBe("A")

    expect(toUpperFirst("aba")).toBe("Aba")
    expect(toUpperFirst("ABA")).toBe("ABA")
    expect(toUpperFirst("aBA")).toBe("ABA")
  })
})
