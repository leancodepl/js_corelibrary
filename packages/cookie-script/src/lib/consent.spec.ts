import { afterEach, describe, expect, it, vi } from "vitest"
import { getAnalyticsConsent, onAnalyticsConsentChange } from "./consent.js"

const consentCookieName = "CookieScriptConsent"

function writeDocumentCookie(value: string) {
  // CookieScript's decision is a document cookie. The tests set that cookie directly.
  // eslint-disable-next-line unicorn/no-document-cookie
  document.cookie = value
}

function setConsentCookie(value: unknown) {
  writeDocumentCookie(`${consentCookieName}=${encodeURIComponent(JSON.stringify(value))}`)
}

function clearConsentCookie() {
  writeDocumentCookie(`${consentCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`)
}

function setLiveState(state: { action?: "accept" | "reject"; categories?: string | string[] }) {
  globalThis.window.CookieScript = {
    instance: {
      currentState: () => state,
    },
  }
}

afterEach(() => {
  clearConsentCookie()
  delete globalThis.window.CookieScript
  Reflect.deleteProperty(globalThis, "cookieStore")
})

describe("getAnalyticsConsent", () => {
  it("returns pending when the visitor has not chosen", () => {
    expect(getAnalyticsConsent()).toBe("pending")
  })

  it("returns pending when the cookie has no action", () => {
    setConsentCookie({ categories: ["performance"] })

    expect(getAnalyticsConsent()).toBe("pending")
  })

  it("returns granted when the accepted categories include the default analytics category", () => {
    setConsentCookie({ action: "accept", categories: ["strict", "performance"] })

    expect(getAnalyticsConsent()).toBe("granted")
  })

  it("returns denied when the visitor accepted other categories only", () => {
    setConsentCookie({ action: "accept", categories: ["marketing"] })

    expect(getAnalyticsConsent()).toBe("denied")
    expect(getAnalyticsConsent("marketing")).toBe("granted")
  })

  it("returns denied when the visitor rejected", () => {
    setConsentCookie({ action: "reject", categories: ["performance"] })

    expect(getAnalyticsConsent()).toBe("denied")
  })

  it("parses categories stored as a JSON string", () => {
    setConsentCookie({ action: "accept", categories: JSON.stringify(["performance"]) })

    expect(getAnalyticsConsent()).toBe("granted")
  })

  it("returns pending when the cookie is not valid JSON", () => {
    writeDocumentCookie(`${consentCookieName}=${encodeURIComponent("{")}`)

    expect(getAnalyticsConsent()).toBe("pending")
  })

  it("returns pending when the cookie JSON is not an object", () => {
    writeDocumentCookie(`${consentCookieName}=${encodeURIComponent("null")}`)

    expect(getAnalyticsConsent()).toBe("pending")
  })

  it("prefers the live banner state over the cookie", () => {
    setConsentCookie({ action: "reject", categories: [] })
    setLiveState({ action: "accept", categories: ["performance"] })

    expect(getAnalyticsConsent()).toBe("granted")
  })

  it("falls back to the cookie when the banner has not loaded", () => {
    setConsentCookie({ action: "accept", categories: ["performance"] })
    globalThis.window.CookieScript = {}

    expect(getAnalyticsConsent()).toBe("granted")
  })
})

describe("onAnalyticsConsentChange", () => {
  it("reports a restored decision when the banner loads and a user decision on accept or reject", () => {
    setLiveState({ action: "accept", categories: ["performance"] })
    const callback = vi.fn()

    onAnalyticsConsentChange(callback)
    globalThis.dispatchEvent(new Event("CookieScriptLoaded"))
    globalThis.dispatchEvent(new Event("CookieScriptAccept"))
    globalThis.dispatchEvent(new Event("CookieScriptAcceptAll"))
    globalThis.dispatchEvent(new Event("CookieScriptReject"))

    expect(callback).toHaveBeenNthCalledWith(1, "granted", "restore")
    expect(callback).toHaveBeenNthCalledWith(2, "granted", "user")
    expect(callback).toHaveBeenNthCalledWith(3, "granted", "user")
    expect(callback).toHaveBeenNthCalledWith(4, "granted", "user")
  })

  it("re-reads consent on each event", () => {
    const callback = vi.fn()
    onAnalyticsConsentChange(callback)

    globalThis.dispatchEvent(new Event("CookieScriptAccept"))
    setLiveState({ action: "accept", categories: ["performance"] })
    globalThis.dispatchEvent(new Event("CookieScriptAccept"))

    expect(callback).toHaveBeenNthCalledWith(1, "pending", "user")
    expect(callback).toHaveBeenLastCalledWith("granted", "user")
  })

  it("checks the category passed to the subscription", () => {
    setLiveState({ action: "accept", categories: ["marketing"] })
    const callback = vi.fn()

    onAnalyticsConsentChange(callback, "marketing")
    globalThis.dispatchEvent(new Event("CookieScriptAccept"))

    expect(callback).toHaveBeenCalledWith("granted", "user")
  })

  it("stops calling back after unsubscribe", () => {
    const callback = vi.fn()
    const unsubscribe = onAnalyticsConsentChange(callback)

    unsubscribe()
    globalThis.dispatchEvent(new Event("CookieScriptLoaded"))
    globalThis.dispatchEvent(new Event("CookieScriptAccept"))

    expect(callback).not.toHaveBeenCalled()
  })

  it("reports a user decision when the consent cookie changes", () => {
    setConsentCookie({ action: "accept", categories: ["performance"] })
    const listeners = new Set<(event: CookieChangeEvent) => void>()
    Object.defineProperty(globalThis, "cookieStore", {
      configurable: true,
      value: {
        addEventListener: (_type: string, listener: (event: CookieChangeEvent) => void) => {
          listeners.add(listener)
        },
        removeEventListener: (_type: string, listener: (event: CookieChangeEvent) => void) => {
          listeners.delete(listener)
        },
      },
    })
    const callback = vi.fn()
    const unsubscribe = onAnalyticsConsentChange(callback)

    const emit = (name: string) => {
      const event = { changed: [{ name }], deleted: [] } as unknown as CookieChangeEvent
      for (const listener of listeners) {
        listener(event)
      }
    }

    emit("other")
    expect(callback).not.toHaveBeenCalled()

    emit(consentCookieName)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith("granted", "user")

    unsubscribe()
    emit(consentCookieName)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(listeners.size).toBe(0)
  })

  it("subscribes when cookieStore is missing", () => {
    Object.defineProperty(globalThis, "cookieStore", { configurable: true, value: undefined })
    const callback = vi.fn()

    expect(() => onAnalyticsConsentChange(callback)).not.toThrow()

    globalThis.dispatchEvent(new Event("CookieScriptReject"))
    expect(callback).toHaveBeenCalledWith("pending", "user")
  })
})
