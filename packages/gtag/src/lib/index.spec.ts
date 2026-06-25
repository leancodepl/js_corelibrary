import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { mkgtag } from "."

describe("mkgtag", () => {
  const originalDataLayer = globalThis.dataLayer

  beforeEach(() => {
    globalThis.dataLayer = undefined
  })

  afterEach(() => {
    globalThis.dataLayer = originalDataLayer
  })

  it("pushes the event to an initialized dataLayer", () => {
    globalThis.dataLayer = []
    const gtag = mkgtag<{ event: "purchase"; value: number }>()

    gtag({ event: "purchase", value: 29.99 })

    expect(globalThis.dataLayer).toEqual([{ event: "purchase", value: 29.99 }])
  })

  it("does not throw when dataLayer is not initialized (GTM absent)", () => {
    const gtag = mkgtag<{ event: "purchase" }>()

    expect(() => gtag({ event: "purchase" })).not.toThrow()
  })

  it("does nothing when dataLayer is undefined", () => {
    const gtag = mkgtag<{ event: "click" }>()

    gtag({ event: "click" })

    expect(globalThis.dataLayer).toBeUndefined()
  })

  it("appends multiple events preserving order", () => {
    globalThis.dataLayer = []
    const gtag = mkgtag<{ event: string }>()

    gtag({ event: "first" })
    gtag({ event: "second" })
    gtag({ event: "third" })

    expect(globalThis.dataLayer).toEqual([{ event: "first" }, { event: "second" }, { event: "third" }])
  })

  it("appends to a dataLayer that already has entries", () => {
    globalThis.dataLayer = [{ event: "existing" }]
    const gtag = mkgtag<{ event: string }>()

    gtag({ event: "new" })

    expect(globalThis.dataLayer).toEqual([{ event: "existing" }, { event: "new" }])
  })

  it("forwards eventCallback and eventTimeout untouched", () => {
    globalThis.dataLayer = []
    const eventCallback = vi.fn()
    const gtag = mkgtag<{ event: "checkout" }>()

    gtag({ event: "checkout", eventCallback, eventTimeout: 2000 })

    expect(globalThis.dataLayer).toEqual([{ event: "checkout", eventCallback, eventTimeout: 2000 }])
    // mkgtag only forwards the arguments; it never invokes the callback itself.
    expect(eventCallback).not.toHaveBeenCalled()
  })

  it("pushes the exact object reference it was given", () => {
    globalThis.dataLayer = []
    const gtag = mkgtag<{ event: "ref" }>()
    const payload = { event: "ref" } as const

    gtag(payload)

    expect(globalThis.dataLayer?.[0]).toBe(payload)
  })

  it("calls the native dataLayer.push exactly once per event", () => {
    const push = vi.fn()
    globalThis.dataLayer = { push } as unknown as typeof globalThis.dataLayer
    const gtag = mkgtag<{ event: "track" }>()

    gtag({ event: "track" })

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith({ event: "track" })
  })

  it("shares the same dataLayer across independent push functions", () => {
    globalThis.dataLayer = []
    const gtagA = mkgtag<{ event: "a" }>()
    const gtagB = mkgtag<{ event: "b" }>()

    gtagA({ event: "a" })
    gtagB({ event: "b" })

    expect(globalThis.dataLayer).toEqual([{ event: "a" }, { event: "b" }])
  })

  it("carries arbitrary typed payload fields through to the dataLayer", () => {
    globalThis.dataLayer = []
    const gtag = mkgtag<{ event: "purchase"; items: string[]; total: number }>()

    gtag({ event: "purchase", items: ["sku-1", "sku-2"], total: 0 })

    expect(globalThis.dataLayer).toEqual([{ event: "purchase", items: ["sku-1", "sku-2"], total: 0 }])
  })
})
