import { afterEach, describe, expect, it, vi } from "vitest"
import { mkGetInjectedConfig } from "."

describe("mkGetInjectedConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("reads a value from import.meta.env using the VITE_ prefix", () => {
    vi.stubEnv("VITE_API_URL", "https://api.example.com")

    const { getInjectedConfig } = mkGetInjectedConfig<"API_URL">()

    expect(getInjectedConfig("API_URL")).toBe("https://api.example.com")
  })

  it("prefixes the key with VITE_ rather than reading the raw key", () => {
    // The raw, unprefixed key must NOT be consulted.
    vi.stubEnv("API_KEY" as `VITE_${string}`, "raw-value-should-be-ignored")
    vi.stubEnv("VITE_API_KEY", "prefixed-value")

    const { getInjectedConfig } = mkGetInjectedConfig<"API_KEY">()

    expect(getInjectedConfig("API_KEY")).toBe("prefixed-value")
  })

  it("returns undefined when the prefixed variable is not set", () => {
    const { getInjectedConfig } = mkGetInjectedConfig<"MISSING">()

    expect(getInjectedConfig("MISSING")).toBeUndefined()
  })

  it("returns an empty string when the variable is explicitly empty", () => {
    vi.stubEnv("VITE_EMPTY", "")

    const { getInjectedConfig } = mkGetInjectedConfig<"EMPTY">()

    // An explicitly-set empty string is distinct from an unset (undefined) value.
    expect(getInjectedConfig("EMPTY")).toBe("")
  })

  it("reflects updated env values on each call (no caching of the value)", () => {
    const { getInjectedConfig } = mkGetInjectedConfig<"DYNAMIC">()

    vi.stubEnv("VITE_DYNAMIC", "first")
    expect(getInjectedConfig("DYNAMIC")).toBe("first")

    vi.stubEnv("VITE_DYNAMIC", "second")
    expect(getInjectedConfig("DYNAMIC")).toBe("second")
  })

  it("resolves independent keys from a single getter", () => {
    vi.stubEnv("VITE_API_URL", "https://api.example.com")
    vi.stubEnv("VITE_API_KEY", "secret-key")

    const { getInjectedConfig } = mkGetInjectedConfig<"API_KEY" | "API_URL">()

    expect(getInjectedConfig("API_URL")).toBe("https://api.example.com")
    expect(getInjectedConfig("API_KEY")).toBe("secret-key")
  })

  it("produces independent getters that share the same underlying env", () => {
    vi.stubEnv("VITE_SHARED", "shared-value")

    const a = mkGetInjectedConfig<"SHARED">()
    const b = mkGetInjectedConfig<"SHARED">()

    expect(a.getInjectedConfig).not.toBe(b.getInjectedConfig)
    expect(a.getInjectedConfig("SHARED")).toBe("shared-value")
    expect(b.getInjectedConfig("SHARED")).toBe("shared-value")
  })

  it("does not collide with a similarly named key that lacks the exact prefix", () => {
    // Only VITE_FOO must match the "FOO" lookup, not VITE_FOOBAR.
    vi.stubEnv("VITE_FOOBAR", "bar")

    const { getInjectedConfig } = mkGetInjectedConfig<"FOO">()

    expect(getInjectedConfig("FOO")).toBeUndefined()
  })
})
