import * as CookieConsent from "vanilla-cookieconsent"
import {
  catAnalytics,
  CategoryKey,
  catNecessary,
  getGoogleConsent,
  ServiceKey,
  serviceKeyCategoriesMap,
} from "./getGoogleConsent"

type ServiceKeysByCategory<C extends CategoryKey> = Extract<
  {
    [K in keyof typeof serviceKeyCategoriesMap]: (typeof serviceKeyCategoriesMap)[K] extends C ? K : never
  }[keyof typeof serviceKeyCategoriesMap],
  ServiceKey
>

type CategoryWithServices<C extends CategoryKey> = Omit<CookieConsent.Category, "services"> & {
  services?: Partial<Record<ServiceKeysByCategory<C>, CookieConsent.Service>>
}

type Categories = Partial<{
  [K in CategoryKey]: CategoryWithServices<K>
}>

export type CookieConsentConfig = Omit<CookieConsent.CookieConsentConfig, "categories"> & {
  categories: Categories
}

function getCookieConsentConfig(config: CookieConsentConfig): CookieConsent.CookieConsentConfig {
  const { categories, onFirstConsent, onChange, onConsent, ...rest } = config
  const supportedServices = Object.values(categories).flatMap(category =>
    Object.keys(category.services ?? {}),
  ) as ServiceKey[]

  const { setDefaultConsent, updateConsent } = getGoogleConsent()
  setDefaultConsent(supportedServices)

  const cookieConsentConfig: CookieConsent.CookieConsentConfig = {
    onFirstConsent: params => {
      updateConsent(supportedServices)
      onFirstConsent?.(params)
    },
    onConsent: params => {
      updateConsent(supportedServices)
      onConsent?.(params)
    },
    onChange: params => {
      updateConsent(supportedServices)
      onChange?.(params)
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

  return cookieConsentConfig
}

/**
 * Runs cookie consent and synchronizes consent state with Google via `"@leancodepl/gtag"`.
 *
 * This function derives supported Google consent services from the provided `categories.services`
 * and automatically calls Google consent APIs on first consent, consent, and change events while
 * preserving any user-provided handlers.
 *
 * @param config - Cookie consent configuration that mirrors `vanilla-cookieconsent` options, with a strongly-typed
 *   `categories` shape. All non-`categories` fields pass through to `vanilla-cookieconsent` unchanged.
 *   For complete configuration details, see the vanilla-cookieconsent documentation: https://cookieconsent.orestbida.com/
 * @returns The `vanilla-cookieconsent` module instance after initialization
 * @example
 * ```typescript
    runCookieConsent({
      categories: {
        analytics: {
          services: {
            analytics_storage: {
              label:
                'Enables storage (such as cookies) related to analytics e.g. visit duration.'
            }
          }
        }
      },
      guiOptions: {
        consentModal: {
          layout: 'box wide',
          position: 'bottom right'
        },
        preferencesModal: {
          layout: 'box'
        }
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies',
              description:
                'This website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage Individual preferences'
            },
            preferencesModal: {
              title: 'Manage cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Accept current selection',
              closeIconLabel: 'Close modal',
              sections: [
                {
                  title: 'Cookie usage',
                  description:
                    'We use cookies to ensure the basic functionalities of the website and to enhance your online experience.'
                },
                {
                  title: 'Strictly necessary cookies',
                  description:
                    'These cookies are essential for the proper functioning of the website, for example for user authentication.',
                  linkedCategory: 'necessary'
                },
                {
                  title: 'Analytics',
                  description:
                    'Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user’s experience.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                    headers: {
                      name: 'Name',
                      domain: 'Service',
                      description: 'Description',
                      expiration: 'Expiration'
                    },
                    body: [
                      {
                        name: '_ga',
                        domain: 'Google Analytics',
                        description:
                          'Cookie set by <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                        expiration: 'Expires after 12 days'
                      },
                      {
                        name: '_gid',
                        domain: 'Google Analytics',
                        description:
                          'Cookie set by <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                        expiration: 'Session'
                      }
                    ]
                  }
                },
                {
                  title: 'Advertising',
                  description:
                    'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at <a href=\"https://g.co/adsettings\">g.co/adsettings</a>), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
                  linkedCategory: 'advertising'
                },
                {
                  title: 'Functionality',
                  description:
                    'Cookies used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user’s choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user’s session, such as the content of a shopping cart.',
                  linkedCategory: 'functionality'
                },
                {
                  title: 'Security',
                  description:
                    'Cookies used for security authenticate users, prevent fraud, and protect users as they interact with a service.',
                  linkedCategory: 'security'
                },
                {
                  title: 'More information',
                  description:
                    'For any queries in relation to the policy on cookies and your choices, please <a href="https://www.example.com/contacts">contact us</a>.'
                }
              ]
            }
          }
        }
      }
    })
 * ```
 */
export async function runCookieConsent(config: CookieConsentConfig): Promise<typeof CookieConsent> {
  const cookieConsent = CookieConsent
  const cookieConsentConfig = getCookieConsentConfig(config)

  await cookieConsent.run(cookieConsentConfig)

  return cookieConsent
}
