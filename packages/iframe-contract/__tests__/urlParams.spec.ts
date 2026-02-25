import { buildRemoteUrl, parseUrlParams } from "../src/lib/urlParams"

const contractVersion = "1.0.0"

describe("buildRemoteUrl", () => {
  it("returns base URL when params are undefined", () => {
    expect(buildRemoteUrl("https://example.com/remote")).toBe("https://example.com/remote")
  })

  it("returns base URL with contractVersion when base params are provided", () => {
    expect(buildRemoteUrl("https://example.com/remote", { contractVersion })).toBe(
      "https://example.com/remote?contractVersion=1.0.0",
    )
  })

  it("appends params as query string", () => {
    const result = buildRemoteUrl("https://example.com/remote", {
      contractVersion,
      userId: "123",
      theme: "dark",
    })
    expect(result).toContain("https://example.com/remote")
    expect(result).toContain("userId=123")
    expect(result).toContain("theme=dark")
    expect(result).toContain("contractVersion=1.0.0")
  })

  it("skips undefined values", () => {
    const result = buildRemoteUrl("https://example.com/remote", {
      userId: "123",
      tenantId: undefined as unknown as string,
      contractVersion,
    })
    expect(result).toContain("contractVersion=1.0.0")
    expect(result).toContain("userId=123")
    expect(result).not.toContain("tenantId")
  })

  it("skips empty string values", () => {
    const result = buildRemoteUrl("https://example.com/remote", {
      userId: "",
      theme: "dark",
      contractVersion,
    })
    expect(result).toContain("contractVersion=1.0.0")
    expect(result).toContain("theme=dark")
    expect(result).not.toContain("userId=")
  })

  it("merges with existing search params in base URL", () => {
    const result = buildRemoteUrl("https://example.com/remote?existing=1", {
      userId: "123",
      contractVersion,
    })
    expect(result).toContain("contractVersion=1.0.0")
    expect(result).toContain("existing=1")
    expect(result).toContain("userId=123")
  })
})

describe("parseUrlParams", () => {
  it("parses search string into object", () => {
    const result = parseUrlParams<{ userId: string; theme: string; contractVersion: string }>(
      "?userId=123&theme=dark&contractVersion=1.0.0",
    )
    expect(result).toEqual({ userId: "123", theme: "dark", contractVersion })
  })

  it("parses params with contractVersion", () => {
    const result = parseUrlParams<{ contractVersion: string }>("?contractVersion=1.0.0")
    expect(result).toEqual({ contractVersion: "1.0.0" })
  })

  it("returns empty object for empty search string", () => {
    const result = parseUrlParams("")
    expect(result).toEqual({})
  })

  it("handles search string without leading question mark", () => {
    const result = parseUrlParams("userId=123&theme=dark")
    expect(result).toEqual({ userId: "123", theme: "dark" })
  })
})
