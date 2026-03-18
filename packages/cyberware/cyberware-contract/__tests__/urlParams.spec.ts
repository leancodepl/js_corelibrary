import { buildRemoteUrl, getUrlParams } from "../src/lib/urlParams"

const contractVersion = "1.0.0"

export function installLocationMock(): void {
  const originalLocation = globalThis.location
  const originalWindow = globalThis.window
  beforeEach(() => {
    setLocationSearch("")
    ;(globalThis as { window?: unknown }).window = {}
  })
  afterEach(() => {
    ;(globalThis as { location?: Location; window?: typeof globalThis & Window }).location =
      originalLocation
    ;(globalThis as { window?: typeof globalThis & Window }).window = originalWindow
  })
}

export function setLocationSearch(search: string): void {
  ;(globalThis as { location: { search: string } }).location = { search }
}

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

describe("getUrlParams", () => {
  installLocationMock()

  it("parses search string into object", () => {
    setLocationSearch("?userId=123&theme=dark&contractVersion=1.0.0")
    const result = getUrlParams<{ userId: string; theme: string; contractVersion: string }>()
    expect(result).toEqual({ userId: "123", theme: "dark", contractVersion: "1.0.0" })
  })

  it("parses params with contractVersion", () => {
    setLocationSearch("?contractVersion=1.0.0")
    const result = getUrlParams<{ contractVersion: string }>()
    expect(result).toEqual({ contractVersion: "1.0.0" })
  })

  it("returns empty object for empty search string", () => {
    const result = getUrlParams()
    expect(result).toEqual({})
  })

  it("handles search string without leading question mark", () => {
    setLocationSearch("userId=123&theme=dark")
    const result = getUrlParams<{ userId: string; theme: string; contractVersion: string }>()
    expect(result).toEqual({ userId: "123", theme: "dark" })
  })
})
