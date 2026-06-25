import type { Translation } from "vanilla-cookieconsent"
import type { CookieConsentConfig } from "./runCookieConsent"
import { getDefaultConsentConfig } from "./getDefaultConsentConfig"

/**
 * getDefaultConsentConfig always emits plain Translation objects, but the
 * vanilla-cookieconsent type allows strings/functions too, so narrow here.
 */
function getTranslation(config: CookieConsentConfig, lang: string): Translation {
  const translation = config.language.translations[lang]

  if (typeof translation !== "object") {
    throw new TypeError(`Expected an object translation for ${lang}`)
  }

  return translation
}

function getSections(config: CookieConsentConfig, lang: string) {
  return getTranslation(config, lang).preferencesModal?.sections ?? []
}

describe("getDefaultConsentConfig", () => {
  describe("language handling", () => {
    it("uses the first provided language as the default", () => {
      const config = getDefaultConsentConfig({ language: ["pl", "en"] })

      expect(config.language.default).toBe("pl")
    })

    it("creates a translation entry for each requested language", () => {
      const config = getDefaultConsentConfig({ language: ["en", "pl"] })

      expect(Object.keys(config.language.translations)).toEqual(["en", "pl"])
    })

    it("falls back to 'en' when an empty language list is given", () => {
      const config = getDefaultConsentConfig({ language: [] })

      expect(config.language.default).toBe("en")
      expect(config.language.translations).toEqual({})
    })

    it("populates localized consent modal copy", () => {
      const config = getDefaultConsentConfig({ language: ["pl"] })

      expect(getTranslation(config, "pl").consentModal?.title).toBe("Używamy plików cookie")
    })
  })

  describe("category enabling", () => {
    it("includes no optional categories by default", () => {
      const config = getDefaultConsentConfig({ language: ["en"] })

      expect(config.categories).toEqual({})
    })

    it("includes only the enabled categories", () => {
      const config = getDefaultConsentConfig({
        language: ["en"],
        analytics: true,
        advertisement: true,
      })

      expect(Object.keys(config.categories).toSorted()).toEqual(["advertisement", "analytics"])
    })

    it("includes every category when all are enabled", () => {
      const config = getDefaultConsentConfig({
        language: ["en"],
        analytics: true,
        advertisement: true,
        functionality: true,
        security: true,
      })

      expect(Object.keys(config.categories).toSorted()).toEqual([
        "advertisement",
        "analytics",
        "functionality",
        "security",
      ])
    })

    it("copies category service definitions from the default language config", () => {
      const config = getDefaultConsentConfig({ language: ["en"], analytics: true })

      expect(config.categories["analytics"]?.services).toHaveProperty("analytics_storage")
    })
  })

  describe("preferences sections", () => {
    it("always includes the base and necessary sections", () => {
      const config = getDefaultConsentConfig({ language: ["en"] })

      const sections = getSections(config, "en")

      expect(sections).toHaveLength(2)
      expect(sections[1]?.linkedCategory).toBe("necessary")
    })

    it("appends a linked section for each enabled category", () => {
      const config = getDefaultConsentConfig({
        language: ["en"],
        analytics: true,
        security: true,
      })

      const linkedCategories = getSections(config, "en")
        .map(s => s.linkedCategory)
        .filter(Boolean)

      expect(linkedCategories).toEqual(["necessary", "analytics", "security"])
    })

    it("preserves the enabled-category ordering (analytics, advertisement, functionality, security)", () => {
      const config = getDefaultConsentConfig({
        language: ["en"],
        security: true,
        analytics: true,
        functionality: true,
        advertisement: true,
      })

      const linkedCategories = getSections(config, "en")
        .map(s => s.linkedCategory)
        .filter(Boolean)

      expect(linkedCategories).toEqual(["necessary", "analytics", "advertisement", "functionality", "security"])
    })

    it("does not add category sections when no optional categories are enabled", () => {
      const config = getDefaultConsentConfig({ language: ["pl"] })

      expect(getSections(config, "pl")).toHaveLength(2)
    })
  })
})
