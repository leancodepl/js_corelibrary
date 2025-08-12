import CookieConsent from "vanilla-cookieconsent"
import { mkgtag } from "@leancodepl/gtag"

export const catNecessary = "necessary"
export const catAnalytics = "analytics"
export const catAdvertisement = "advertisement"
export const catFunctionality = "functionality"
export const catSecurity = "security"

export const serviceAdStorage = "ad_storage"
export const serviceAdUserData = "ad_user_data"
export const serviceAdPersonalization = "ad_personalization"
export const serviceAnalyticsStorage = "analytics_storage"
export const serviceFunctionalityStorage = "functionality_storage"
export const servicePersonalizationStorage = "personalization_storage"
export const serviceSecurityStorage = "security_storage"

type ServiceValue = "denied" | "granted"

type ConsentSettings = {
  [serviceAdStorage]: ServiceValue
  [serviceAdUserData]: ServiceValue
  [serviceAdPersonalization]: ServiceValue
  [serviceAnalyticsStorage]: ServiceValue
  [serviceFunctionalityStorage]: ServiceValue
  [servicePersonalizationStorage]: ServiceValue
  [serviceSecurityStorage]: ServiceValue
}

const gtag = mkgtag<{ event: "cookie_consent_update" | "default_cookie_consent"; settings: ConsentSettings }>()

gtag({
  event: "default_cookie_consent",
  settings: {
    [serviceAdStorage]: "denied",
    [serviceAdUserData]: "denied",
    [serviceAdPersonalization]: "denied",
    [serviceAnalyticsStorage]: "denied",
    [serviceFunctionalityStorage]: "denied",
    [servicePersonalizationStorage]: "denied",
    [serviceSecurityStorage]: "denied",
  },
})

export function updateGtagConsent() {
  gtag({
    event: "cookie_consent_update",
    settings: {
      [serviceAnalyticsStorage]: getServiceValue(serviceAnalyticsStorage, catAnalytics),
      [serviceAdStorage]: getServiceValue(serviceAdStorage, catAdvertisement),
      [serviceAdUserData]: getServiceValue(serviceAdUserData, catAdvertisement),
      [serviceAdPersonalization]: getServiceValue(serviceAdPersonalization, catAdvertisement),
      [serviceFunctionalityStorage]: getServiceValue(serviceFunctionalityStorage, catFunctionality),
      [servicePersonalizationStorage]: getServiceValue(servicePersonalizationStorage, catFunctionality),
      [serviceSecurityStorage]: getServiceValue(serviceSecurityStorage, catSecurity),
    },
  })
}

export function getServiceValue(serviceName: string, categoryName: string) {
  return CookieConsent.acceptedService(serviceName, categoryName) ? "granted" : "denied"
}
