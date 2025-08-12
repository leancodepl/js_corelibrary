import * as CookieConsent from "vanilla-cookieconsent"
import {
  catAdvertisement,
  catAnalytics,
  catFunctionality,
  catNecessary,
  catSecurity,
  updateGtagConsent,
} from "./getGtagConfig"

type CategoryKey =
  | typeof catAdvertisement
  | typeof catAnalytics
  | typeof catFunctionality
  | typeof catNecessary
  | typeof catSecurity

type Categories = Partial<Record<CategoryKey, CookieConsent.Category>>

type CookieConsentOverrides = Partial<Omit<CookieConsent.CookieConsentConfig, "categories" | "language">> & {
  language: CookieConsent.CookieConsentConfig["language"]
  categories: Categories
}

function getCookieConsentConfig(overrides: CookieConsentOverrides): CookieConsent.CookieConsentConfig {
  const { categories, ...rest } = overrides

  const config: CookieConsent.CookieConsentConfig = {
    onFirstConsent: () => {
      updateGtagConsent()
    },
    onConsent: () => {
      updateGtagConsent()
    },
    onChange: () => {
      updateGtagConsent()
    },
    categories: {
      [catNecessary]: {
        enabled: true,
        readOnly: true,
        ...categories[catNecessary],
      },
      [catAnalytics]: {
        autoClear: {
          cookies: [{ name: /^_ga/ }, { name: "_gid" }],
        },
        ...categories[catAnalytics],
      },
      ...categories,
    },
    ...rest,
  }

  return config
}

export async function runCookieConsent(overrides: CookieConsentOverrides): Promise<typeof CookieConsent> {
  const cookieConsent = CookieConsent
  const config = getCookieConsentConfig(overrides)

  await cookieConsent.run(config)

  return cookieConsent
}
