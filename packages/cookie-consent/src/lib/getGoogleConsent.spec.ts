import * as CookieConsent from "vanilla-cookieconsent"
import {
  catAdvertisement,
  catAnalytics,
  catFunctionality,
  catSecurity,
  getGoogleConsent,
  getServiceValue,
  serviceAdPersonalization,
  serviceAdStorage,
  serviceAdUserData,
  serviceAnalyticsStorage,
  serviceFunctionalityStorage,
  serviceKeyCategoriesMap,
  servicePersonalizationStorage,
  serviceSecurityStorage,
} from "./getGoogleConsent"

vi.mock("vanilla-cookieconsent", () => ({
  acceptedService: vi.fn(),
}))

const acceptedService = vi.mocked(CookieConsent.acceptedService)

type DataLayerEvent = { event: string; settings: Record<string, string> }

const globalWithDataLayer = globalThis as { dataLayer?: DataLayerEvent[] }

function getDataLayer(): DataLayerEvent[] {
  return globalWithDataLayer.dataLayer ?? []
}

describe("serviceKeyCategoriesMap", () => {
  it("maps every service to the expected category", () => {
    expect(serviceKeyCategoriesMap).toEqual({
      [serviceAdStorage]: catAdvertisement,
      [serviceAnalyticsStorage]: catAnalytics,
      [serviceFunctionalityStorage]: catFunctionality,
      [servicePersonalizationStorage]: catFunctionality,
      [serviceSecurityStorage]: catSecurity,
      [serviceAdUserData]: catAdvertisement,
      [serviceAdPersonalization]: catAdvertisement,
    })
  })

  it("covers all seven known services", () => {
    expect(Object.keys(serviceKeyCategoriesMap)).toHaveLength(7)
  })
})

describe("getServiceValue", () => {
  beforeEach(() => {
    acceptedService.mockReset()
  })

  it("returns 'granted' when the service is accepted", () => {
    acceptedService.mockReturnValue(true)

    expect(getServiceValue(serviceAnalyticsStorage, catAnalytics)).toBe("granted")
    expect(acceptedService).toHaveBeenCalledWith(serviceAnalyticsStorage, catAnalytics)
  })

  it("returns 'denied' when the service is not accepted", () => {
    acceptedService.mockReturnValue(false)

    expect(getServiceValue(serviceAdStorage, catAdvertisement)).toBe("denied")
    expect(acceptedService).toHaveBeenCalledWith(serviceAdStorage, catAdvertisement)
  })
})

describe("getGoogleConsent", () => {
  beforeEach(() => {
    acceptedService.mockReset()
    globalWithDataLayer.dataLayer = []
  })

  afterEach(() => {
    globalWithDataLayer.dataLayer = undefined
  })

  describe("setDefaultConsent", () => {
    it("pushes a default_cookie_consent event with all services denied", () => {
      const { setDefaultConsent } = getGoogleConsent()

      setDefaultConsent([serviceAnalyticsStorage, serviceAdStorage])

      expect(getDataLayer()).toEqual([
        {
          event: "default_cookie_consent",
          settings: {
            [serviceAnalyticsStorage]: "denied",
            [serviceAdStorage]: "denied",
          },
        },
      ])
    })

    it("pushes an empty settings object when given no services", () => {
      const { setDefaultConsent } = getGoogleConsent()

      setDefaultConsent([])

      expect(getDataLayer()).toEqual([{ event: "default_cookie_consent", settings: {} }])
    })

    it("does not throw when dataLayer is not initialized", () => {
      globalWithDataLayer.dataLayer = undefined
      const { setDefaultConsent } = getGoogleConsent()

      expect(() => setDefaultConsent([serviceAnalyticsStorage])).not.toThrow()
    })
  })

  describe("updateConsent", () => {
    it("pushes a cookie_consent_update event resolving each service value", () => {
      // analytics accepted, advertising denied
      acceptedService.mockImplementation(serviceName => serviceName === serviceAnalyticsStorage)

      const { updateConsent } = getGoogleConsent()

      updateConsent([serviceAnalyticsStorage, serviceAdStorage])

      expect(getDataLayer()).toEqual([
        {
          event: "cookie_consent_update",
          settings: {
            [serviceAnalyticsStorage]: "granted",
            [serviceAdStorage]: "denied",
          },
        },
      ])
    })

    it("queries acceptedService with each service's mapped category", () => {
      acceptedService.mockReturnValue(false)

      const { updateConsent } = getGoogleConsent()

      updateConsent([serviceFunctionalityStorage, serviceSecurityStorage])

      expect(acceptedService).toHaveBeenCalledWith(serviceFunctionalityStorage, catFunctionality)
      expect(acceptedService).toHaveBeenCalledWith(serviceSecurityStorage, catSecurity)
    })

    it("grants all services when everything is accepted", () => {
      acceptedService.mockReturnValue(true)

      const { updateConsent } = getGoogleConsent()

      updateConsent([serviceAdUserData, serviceAdPersonalization, servicePersonalizationStorage])

      expect(getDataLayer()).toEqual([
        {
          event: "cookie_consent_update",
          settings: {
            [serviceAdUserData]: "granted",
            [serviceAdPersonalization]: "granted",
            [servicePersonalizationStorage]: "granted",
          },
        },
      ])
    })
  })
})
