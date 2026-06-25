import { FunctionComponent, ReactNode } from "react"
import { OpenFeatureProvider, useFlag } from "@openfeature/react-sdk"
import { InMemoryProvider, OpenFeature } from "@openfeature/web-sdk"
import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { mkFeatureFlags } from "./mkFeatureFlags"

vi.mock("@openfeature/react-sdk", async importActual => {
  const actual = await importActual<typeof import("@openfeature/react-sdk")>()
  return {
    ...actual,
    useFlag: vi.fn(actual.useFlag),
  }
})

const flags = {
  boolFlag: { defaultValue: false },
  stringFlag: { defaultValue: "fallback" },
  numberFlag: { defaultValue: 0 },
}

function arrange(flagConfiguration: ConstructorParameters<typeof InMemoryProvider>[0] = {}) {
  const provider = new InMemoryProvider(flagConfiguration)

  const featureFlags = mkFeatureFlags(flags, provider)

  const wrapper: FunctionComponent<{ children: ReactNode }> = ({ children }) => (
    <featureFlags.FeatureFlagsProvider>{children}</featureFlags.FeatureFlagsProvider>
  )

  return { provider, wrapper, ...featureFlags }
}

describe("mkFeatureFlags", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(async () => {
    // reset global OpenFeature state so tests stay isolated
    await OpenFeature.clearContext()
    await OpenFeature.clearProviders()
  })

  describe("provider registration", () => {
    it("registers the supplied provider with OpenFeature", () => {
      const setProvider = vi.spyOn(OpenFeature, "setProvider")
      const provider = new InMemoryProvider({})

      mkFeatureFlags(flags, provider)

      expect(setProvider).toHaveBeenCalledTimes(1)
      expect(setProvider).toHaveBeenCalledWith(provider)
    })
  })

  describe("returned api", () => {
    it("exposes the OpenFeatureProvider as FeatureFlagsProvider", () => {
      const { FeatureFlagsProvider } = arrange()

      expect(FeatureFlagsProvider).toBe(OpenFeatureProvider)
    })

    it("exposes useFeatureFlag and setFeatureFlagsContext", () => {
      const { useFeatureFlag, setFeatureFlagsContext } = arrange()

      expect(typeof useFeatureFlag).toBe("function")
      expect(typeof setFeatureFlagsContext).toBe("function")
    })
  })

  describe("setFeatureFlagsContext", () => {
    it("delegates to OpenFeature.setContext with the correct binding", async () => {
      const setContext = vi.spyOn(OpenFeature, "setContext").mockResolvedValue(undefined)
      const { setFeatureFlagsContext } = arrange()

      const context = { targetingKey: "user-1", country: "PL" }
      await setFeatureFlagsContext(context)

      expect(setContext).toHaveBeenCalledTimes(1)
      expect(setContext).toHaveBeenCalledWith(context)
    })

    it("stays callable after destructuring (this is bound to OpenFeature)", async () => {
      const { setFeatureFlagsContext } = arrange()

      // would throw if `this` were lost during destructuring
      await expect(setFeatureFlagsContext({ targetingKey: "user-2" })).resolves.toBeUndefined()
    })
  })

  describe("useFeatureFlag", () => {
    it("resolves the value configured in the provider", async () => {
      const { useFeatureFlag, wrapper } = arrange({
        boolFlag: { disabled: false, variants: { on: true, off: false }, defaultVariant: "on" },
      })

      const { result } = renderHook(() => useFeatureFlag("boolFlag"), { wrapper })

      await waitFor(() => {
        expect(result.current.value).toBe(true)
      })
    })

    it("falls back to the per-flag defaultValue when the flag is missing from the provider", () => {
      const { useFeatureFlag, wrapper } = arrange({})

      const { result } = renderHook(() => useFeatureFlag("stringFlag"), { wrapper })

      expect(result.current.value).toBe("fallback")
    })

    it("prefers an explicit defaultValue over the per-flag defaultValue", () => {
      const { useFeatureFlag, wrapper } = arrange({})

      const { result } = renderHook(() => useFeatureFlag("stringFlag", "explicit"), { wrapper })

      expect(result.current.value).toBe("explicit")
    })

    it("uses an explicit falsy defaultValue rather than discarding it", () => {
      // guards the `defaultValue ?? flags[key]?.defaultValue` nullish-coalescing logic:
      // an explicit `false` must be respected, not replaced by the per-flag default.
      const explicitFalse = arrange({})
      const { result: falseResult } = renderHook(() => explicitFalse.useFeatureFlag("boolFlag", false), {
        wrapper: explicitFalse.wrapper,
      })
      expect(falseResult.current.value).toBe(false)

      // and an explicit empty string is kept as-is
      const explicitEmpty = arrange({})
      const { result: emptyResult } = renderHook(() => explicitEmpty.useFeatureFlag("stringFlag", ""), {
        wrapper: explicitEmpty.wrapper,
      })
      expect(emptyResult.current.value).toBe("")
    })

    it("passes the stringified key and resolved default through to the underlying useFlag", () => {
      const { useFeatureFlag, wrapper } = arrange({})
      vi.mocked(useFlag).mockClear()

      renderHook(() => useFeatureFlag("numberFlag", 42), { wrapper })

      expect(useFlag).toHaveBeenCalledWith("numberFlag", 42)
    })

    it("evaluates configured number flags from the provider", async () => {
      const { useFeatureFlag, wrapper } = arrange({
        numberFlag: { disabled: false, variants: { high: 100, low: 1 }, defaultVariant: "high" },
      })

      const { result } = renderHook(() => useFeatureFlag("numberFlag", 0), { wrapper })

      await waitFor(() => {
        expect(result.current.value).toBe(100)
      })
    })

    it("falls back to the default value when the flag is disabled in the provider", () => {
      const { useFeatureFlag, wrapper } = arrange({
        stringFlag: { disabled: true, variants: { a: "configured" }, defaultVariant: "a" },
      })

      const { result } = renderHook(() => useFeatureFlag("stringFlag"), { wrapper })

      // disabled flag -> client returns the default value handed to useFlag
      expect(result.current.value).toBe("fallback")
    })
  })
})
