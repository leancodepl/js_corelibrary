# @leancodepl/cookie-consent

Cookie consent helper that wires `vanilla-cookieconsent` with Google Consent Mode via `"@leancodepl/gtag"`.

## Installation

```bash
npm install @leancodepl/cookie-consent
# or
yarn add @leancodepl/cookie-consent
```

## API

### `getDefaultConsentConfig(options)`

Creates a default cookie consent configuration with configurable languages and categories.

- **Parameters**
  - `options: DefaultConsentOptions` – Configuration options for languages and enabled categories
    - `language: ("en" | "pl")[]` – Supported languages array
    - `advertisement?: boolean` – Enable advertisement category
    - `analytics?: boolean` – Enable analytics category
    - `security?: boolean` – Enable security category
    - `functionality?: boolean` – Enable functionality category
- **Returns**
  - `CookieConsentConfig` – Complete cookie consent configuration ready for `runCookieConsent`

### `runCookieConsent(config)`

Runs cookie consent and synchronizes consent state with Google via `"@leancodepl/gtag"`.

- **Parameters**
  - `config: CookieConsentConfig` – Cookie consent configuration mirroring `vanilla-cookieconsent` options, with a
    strongly-typed `categories` shape for Google Consent Mode services.
- **Returns**
  - `Promise<typeof CookieConsent>` – The `vanilla-cookieconsent` module instance after initialization

## Usage Examples

### Using Default Configuration

```jsx
import "vanilla-cookieconsent/dist/cookieconsent.css"
import { getDefaultConsentConfig, runCookieConsent } from "@leancodepl/cookie-consent"

useEffect(() => {
  const config = getDefaultConsentConfig({
    language: ["en", "pl"], // English as default
    analytics: true,
    advertisement: true,
    functionality: true,
  })

  runCookieConsent(config)
}, [])
```

### Custom Configuration

```jsx
import "vanilla-cookieconsent/dist/cookieconsent.css"
import "yourCustomStyles.css" // custom optional styles

useEffect(() => {
  runCookieConsent({
    categories: {
      analytics: {
        services: {
          analytics_storage: {
            label: "Enables storage (such as cookies) related to analytics e.g. visit duration.",
          },
        },
      },
    },
    guiOptions: {
      consentModal: {
        layout: "box wide",
        position: "bottom right",
      },
      preferencesModal: {
        layout: "box",
      },
    },
    language: {
      default: "en",
      translations: {
        en: {
          consentModal: {
            title: "We use cookies",
            description:
              "This website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent.",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
            showPreferencesBtn: "Manage Individual preferences",
          },
          preferencesModal: {
            title: "Manage cookie preferences",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
            savePreferencesBtn: "Accept current selection",
            closeIconLabel: "Close modal",
            sections: [
              {
                title: "Cookie usage",
                description:
                  "We use cookies to ensure the basic functionalities of the website and to enhance your online experience.",
              },
              {
                title: "Strictly necessary cookies",
                description:
                  "These cookies are essential for the proper functioning of the website, for example for user authentication.",
                linkedCategory: "necessary",
              },
              {
                title: "Analytics",
                description:
                  "Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user’s experience.",
                linkedCategory: "analytics",
                cookieTable: {
                  headers: {
                    name: "Name",
                    domain: "Service",
                    description: "Description",
                    expiration: "Expiration",
                  },
                  body: [
                    {
                      name: "_ga",
                      domain: "Google Analytics",
                      description:
                        'Cookie set by <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                      expiration: "Expires after 12 days",
                    },
                    {
                      name: "_gid",
                      domain: "Google Analytics",
                      description:
                        'Cookie set by <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                      expiration: "Session",
                    },
                  ],
                },
              },
              {
                title: "Advertising",
                description:
                  'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at <a href=\"https://g.co/adsettings\">g.co/adsettings</a>), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
                linkedCategory: "advertising",
              },
              {
                title: "Functionality",
                description:
                  "Cookies used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user’s choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user’s session, such as the content of a shopping cart.",
                linkedCategory: "functionality",
              },
              {
                title: "Security",
                description:
                  "Cookies used for security authenticate users, prevent fraud, and protect users as they interact with a service.",
                linkedCategory: "security",
              },
              {
                title: "More information",
                description:
                  'For any queries in relation to the policy on cookies and your choices, please <a href="https://www.example.com/contacts">contact us</a>.',
              },
            ],
          },
        },
      },
    },
  })
}, [])
```

For advanced configuration and UI customization, refer to the official vanilla-cookieconsent documentation:
https://cookieconsent.orestbida.com/
