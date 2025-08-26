import * as CookieConsent from "vanilla-cookieconsent"
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

export type ServiceKey =
  | typeof serviceAdPersonalization
  | typeof serviceAdStorage
  | typeof serviceAdUserData
  | typeof serviceAnalyticsStorage
  | typeof serviceFunctionalityStorage
  | typeof servicePersonalizationStorage
  | typeof serviceSecurityStorage
export type CategoryKey =
  | typeof catAdvertisement
  | typeof catAnalytics
  | typeof catFunctionality
  | typeof catNecessary
  | typeof catSecurity

type ConsentSettings = Partial<Record<ServiceKey, ServiceValue>>

export const serviceKeyCategoriesMap: Record<ServiceKey, CategoryKey> = {
  [serviceAdStorage]: catAdvertisement,
  [serviceAnalyticsStorage]: catAnalytics,
  [serviceFunctionalityStorage]: catFunctionality,
  [servicePersonalizationStorage]: catFunctionality,
  [serviceSecurityStorage]: catSecurity,
  [serviceAdUserData]: catAdvertisement,
  [serviceAdPersonalization]: catAdvertisement,
}

export function getGoogleConsent() {
  const gtag = mkgtag<{ event: "cookie_consent_update" | "default_cookie_consent"; settings: ConsentSettings }>()

  function setDefaultConsent(serviceKeys: ServiceKey[]) {
    gtag({
      event: "default_cookie_consent",
      settings: Object.fromEntries(serviceKeys.map(serviceName => [serviceName, "denied"])),
    })
  }

  function updateConsent(serviceKeys: ServiceKey[]) {
    gtag({
      event: "cookie_consent_update",
      settings: Object.fromEntries(
        serviceKeys.map(serviceKey => [serviceKey, getServiceValue(serviceKey, serviceKeyCategoriesMap[serviceKey])]),
      ),
    })
  }

  return { setDefaultConsent, updateConsent }
}
export function getServiceValue(serviceName: ServiceKey, categoryName: CategoryKey) {
  return CookieConsent.acceptedService(serviceName, categoryName) ? "granted" : "denied"
}
