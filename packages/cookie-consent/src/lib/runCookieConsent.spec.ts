import * as CookieConsent from "vanilla-cookieconsent"
import { type CookieConsentConfig, runCookieConsent } from "./runCookieConsent"

vi.mock("vanilla-cookieconsent", () => ({
  run: vi.fn(),
  acceptedService: vi.fn(() => false),
}))

const run = vi.mocked(CookieConsent.run)

type DataLayerEvent = { event: string; settings: Record<string, string> }

const globalWithDataLayer = globalThis as { dataLayer?: DataLayerEvent[] }

function getDataLayer(): DataLayerEvent[] {
  return globalWithDataLayer.dataLayer ?? []
}

function clearDataLayer() {
  globalWithDataLayer.dataLayer = []
}

function unsetDataLayer() {
  globalWithDataLayer.dataLayer = undefined
}

/**
 * Pulls out the resolved vanilla-cookieconsent config object that runCookieConsent
 * passed into CookieConsent.run.
 */
function getResolvedConfig(): CookieConsent.CookieConsentConfig {
  expect(run).toHaveBeenCalledTimes(1)
  const call = run.mock.calls[0]
  if (!call) {
    throw new Error("CookieConsent.run was not called")
  }
  return call[0]
}

const language: CookieConsentConfig["language"] = {
  default: "en",
  translations: { en: { consentModal: {}, preferencesModal: { sections: [] } } },
}

const analyticsConfig: CookieConsentConfig = {
  language,
  categories: {
    analytics: {
      services: {
        analytics_storage: { label: "analytics" },
      },
    },
    advertisement: {
      services: {
        ad_storage: { label: "ads" },
      },
    },
  },
}

const consentParams = {} as Parameters<NonNullable<CookieConsent.CookieConsentConfig["onConsent"]>>[0]
const changeParams = {
  cookie: consentParams.cookie,
  changedCategories: [],
  changedServices: {},
} as Parameters<NonNullable<CookieConsent.CookieConsentConfig["onChange"]>>[0]

describe("runCookieConsent", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearDataLayer()
  })

  afterEach(() => {
    unsetDataLayer()
  })

  it("invokes CookieConsent.run and resolves with the module instance", async () => {
    const result = await runCookieConsent(analyticsConfig)

    expect(run).toHaveBeenCalledTimes(1)
    expect(result).toBe(CookieConsent)
  })

  it("pushes a default_cookie_consent event for the derived services before running", async () => {
    await runCookieConsent(analyticsConfig)

    expect(getDataLayer()).toEqual([
      {
        event: "default_cookie_consent",
        settings: {
          analytics_storage: "denied",
          ad_storage: "denied",
        },
      },
    ])
  })

  it("always injects necessary and analytics categories with their defaults", async () => {
    await runCookieConsent({ language, categories: {} })

    const resolved = getResolvedConfig()

    expect(resolved.categories["necessary"]).toEqual({ enabled: true, readOnly: true })
    expect(resolved.categories["analytics"]).toEqual({
      autoClear: { cookies: [{ name: /^_ga/ }, { name: "_gid" }] },
    })
  })

  it("lets a user-supplied analytics category override the injected default", async () => {
    await runCookieConsent({
      language,
      categories: {
        analytics: { services: { analytics_storage: { label: "custom" } } },
      },
    })

    const resolved = getResolvedConfig()

    // user category is spread last, so services are preserved
    expect(resolved.categories["analytics"]?.services).toHaveProperty("analytics_storage")
  })

  it("passes through non-category config fields untouched", async () => {
    await runCookieConsent({
      language,
      categories: {},
      guiOptions: { consentModal: { layout: "box wide" } },
    })

    const resolved = getResolvedConfig()

    expect(resolved.guiOptions).toEqual({ consentModal: { layout: "box wide" } })
  })

  describe("consent callbacks", () => {
    it("calls updateConsent and the user's onConsent handler on consent", async () => {
      const onConsent = vi.fn()

      await runCookieConsent({ ...analyticsConfig, onConsent })

      const resolved = getResolvedConfig()
      clearDataLayer()

      resolved.onConsent?.(consentParams)

      expect(onConsent).toHaveBeenCalledWith(consentParams)
      expect(getDataLayer()).toEqual([
        {
          event: "cookie_consent_update",
          settings: { analytics_storage: "denied", ad_storage: "denied" },
        },
      ])
    })

    it("calls updateConsent and the user's onChange handler on change", async () => {
      const onChange = vi.fn()

      await runCookieConsent({ ...analyticsConfig, onChange })

      const resolved = getResolvedConfig()
      clearDataLayer()

      resolved.onChange?.(changeParams)

      expect(onChange).toHaveBeenCalledWith(changeParams)
      expect(getDataLayer()).toHaveLength(1)
      expect(getDataLayer()[0]?.event).toBe("cookie_consent_update")
    })

    it("calls updateConsent and the user's onFirstConsent handler on first consent", async () => {
      const onFirstConsent = vi.fn()

      await runCookieConsent({ ...analyticsConfig, onFirstConsent })

      const resolved = getResolvedConfig()
      clearDataLayer()

      resolved.onFirstConsent?.(consentParams)

      expect(onFirstConsent).toHaveBeenCalledWith(consentParams)
      expect(getDataLayer()).toHaveLength(1)
    })

    it("works when no user callbacks are provided", async () => {
      await runCookieConsent(analyticsConfig)

      const resolved = getResolvedConfig()

      expect(() => resolved.onConsent?.(consentParams)).not.toThrow()
      expect(() => resolved.onChange?.(changeParams)).not.toThrow()
      expect(() => resolved.onFirstConsent?.(consentParams)).not.toThrow()
    })

    it("reflects granted services from acceptedService in the update event", async () => {
      vi.mocked(CookieConsent.acceptedService).mockImplementation(serviceName => serviceName === "analytics_storage")

      await runCookieConsent(analyticsConfig)

      const resolved = getResolvedConfig()
      clearDataLayer()

      resolved.onConsent?.(consentParams)

      expect(getDataLayer()).toEqual([
        {
          event: "cookie_consent_update",
          settings: { analytics_storage: "granted", ad_storage: "denied" },
        },
      ])
    })
  })

  it("derives no services when categories have none", async () => {
    await runCookieConsent({ language, categories: { necessary: {} } })

    expect(getDataLayer()).toEqual([{ event: "default_cookie_consent", settings: {} }])
  })
})
