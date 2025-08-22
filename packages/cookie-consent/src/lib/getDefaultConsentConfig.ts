import { Translation } from "vanilla-cookieconsent"
import { config } from "./config"
import { catAdvertisement, catAnalytics, catFunctionality, catSecurity } from "./getGoogleConsent"
import type { CookieConsentConfig } from "./runCookieConsent"

type Language = "en" | "pl"
export interface DefaultConsentOptions {
  language: Language[]
  advertisement?: boolean
  analytics?: boolean
  security?: boolean
  functionality?: boolean
}

const categories = [catAnalytics, catAdvertisement, catFunctionality, catSecurity] as const

function buildPreferencesSections(
  langConfig: (typeof config)[Language],
  options: { analytics?: boolean; advertisement?: boolean; functionality?: boolean; security?: boolean },
) {
  const sections = [
    langConfig.language.preferencesModal.baseSection,
    {
      ...langConfig.language.preferencesModal.necessarySection,
      linkedCategory: "necessary",
    },
  ]

  for (const key of categories) {
    if (options[key]) {
      sections.push({
        ...langConfig.language.categoryPreferenceLabels[key],
        linkedCategory: key,
      })
    }
  }

  return sections
}

const fallbackLanguage: Language = "en"
/**
 * Creates a default cookie consent configuration with configurable languages and categories.
 *
 * @param options - Configuration options for languages and enabled categories
 * @returns Complete cookie consent configuration ready for runCookieConsent
 *
 * @example
 * ```typescript
 * const config = getDefaultConsentConfig({
 *   language: ["en", "pl"],
 *   advertisement: true,
 *   analytics: true,
 *   security: true
 * })
 *
 * runCookieConsent(config)
 * ```
 */
export function getDefaultConsentConfig({
  language = [fallbackLanguage],
  advertisement = false,
  analytics = false,
  security = false,
  functionality = false,
}: DefaultConsentOptions): CookieConsentConfig {
  const categoryOptions = { analytics, advertisement, functionality, security }

  const defaultLanguage = language.at(0) ?? fallbackLanguage
  const defaultLanguageConfig = config[defaultLanguage]

  const supportedCategories: CookieConsentConfig["categories"] = {}
  for (const key of categories) {
    if (categoryOptions[key]) {
      supportedCategories[key] = defaultLanguageConfig.categories[key]
    }
  }

  const languageTranslations: Record<string, Translation> = {}

  for (const lang of language) {
    const langConfig = config[lang]

    languageTranslations[lang] = {
      consentModal: langConfig.language.consentModal,
      preferencesModal: {
        ...langConfig.language.preferencesModal,
        sections: buildPreferencesSections(langConfig, categoryOptions),
      },
    }
  }

  return {
    categories: supportedCategories,
    language: {
      default: defaultLanguage,
      translations: languageTranslations,
    },
  }
}
