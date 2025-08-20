import {
  catAdvertisement,
  catAnalytics,
  catFunctionality,
  catSecurity,
  serviceAdPersonalization,
  serviceAdStorage,
  serviceAdUserData,
  serviceAnalyticsStorage,
  serviceFunctionalityStorage,
  servicePersonalizationStorage,
  serviceSecurityStorage,
} from "./getGoogleConsent"

const googleAnalyticsCookieName = "_ga"
const googleAnalyticsSessionCookieName = "_gid"

export const config = {
  en: {
    language: {
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
        baseSection: {
          title: "Cookie usage",
          description:
            "We use cookies to ensure the basic functionalities of the website and to enhance your online experience.",
        },
        necessarySection: {
          title: "Strictly necessary cookies",
          description:
            "These cookies are essential for the proper functioning of the website, for example for user authentication.",
        },
      },
      categoryPreferenceLabels: {
        analytics: {
          title: "Analytics",
          description:
            "Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user's experience.",
          cookieTable: {
            headers: { name: "Name", domain: "Service", description: "Description", expiration: "Expiration" },
            body: [
              {
                name: googleAnalyticsCookieName,
                domain: "Google Analytics",
                description: 'Cookie set by <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                expiration: "Expires after 12 days",
              },
              {
                name: googleAnalyticsSessionCookieName,
                domain: "Google Analytics",
                description: 'Cookie set by <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                expiration: "Session",
              },
            ],
          },
        },
        advertisement: {
          title: "Advertising",
          description:
            'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at <a href="https://g.co/adsettings">g.co/adsettings</a>), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
        },
        functionality: {
          title: "Functionality",
          description:
            "Cookies used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user's choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user's session, such as the content of a shopping cart.",
        },
        security: {
          title: "Security",
          description:
            "Cookies used for security authenticate users, prevent fraud, and protect users as they interact with a service.",
        },
      },
    },
    categories: {
      [catAnalytics]: {
        services: {
          [serviceAnalyticsStorage]: {
            label: "Enables storage (such as cookies) related to analytics e.g. visit duration.",
          },
        },
      },
      [catAdvertisement]: {
        enabled: true,
        readOnly: false,
        services: {
          [serviceAdStorage]: {
            label: "Enables storage (such as cookies) related to advertising.",
          },
          [serviceAdUserData]: {
            label: "Sets consent for sending user data related to advertising to Google.",
          },
          [serviceAdPersonalization]: {
            label: "Sets consent for personalized advertising.",
          },
        },
      },
      [catFunctionality]: {
        enabled: true,
        readOnly: false,
        services: {
          [serviceFunctionalityStorage]: {
            label: "Enables storage that supports the functionality of the website or app e.g. language settings.",
          },
          [servicePersonalizationStorage]: {
            label: "Enables storage related to personalization e.g. video recommendations.",
          },
        },
      },
      [catSecurity]: {
        enabled: true,
        readOnly: false,
        services: {
          [serviceSecurityStorage]: {
            label:
              "Enables storage related to security such as authentication functionality, fraud prevention, and other user protection.",
          },
        },
      },
    },
  },
  pl: {
    language: {
      consentModal: {
        title: "Używamy plików cookie",
        description:
          "Ta strona internetowa wykorzystuje niezbędne pliki cookie w celu zapewnienia jej prawidłowego działania oraz pliki cookie śledzące w celu zrozumienia sposobu interakcji użytkowników z witryną. Te ostatnie będą ustawione tylko po wyrażeniu zgody.",
        acceptAllBtn: "Zaakceptuj wszystkie",
        acceptNecessaryBtn: "Odrzuć wszystkie",
        showPreferencesBtn: "Zarządzaj indywidualnymi preferencjami",
      },
      preferencesModal: {
        title: "Zarządzaj preferencjami plików cookie",
        acceptAllBtn: "Zaakceptuj wszystkie",
        acceptNecessaryBtn: "Odrzuć wszystkie",
        savePreferencesBtn: "Zaakceptuj bieżący wybór",
        closeIconLabel: "Zamknij okno",
        baseSection: {
          title: "Używanie plików cookie",
          description:
            "Używamy plików cookie w celu zapewnienia podstawowej funkcjonalności strony internetowej oraz poprawy Twojego doświadczenia online.",
        },
        necessarySection: {
          title: "Ściśle niezbędne pliki cookie",
          description:
            "Te pliki cookie są niezbędne do prawidłowego funkcjonowania strony internetowej, na przykład do uwierzytelniania użytkowników.",
        },
      },
      categoryPreferenceLabels: {
        analytics: {
          title: "Analityka",
          description:
            "Pliki cookie używane do analityki pomagają zbierać dane, które umożliwiają usługom zrozumienie sposobu interakcji użytkowników z określoną usługą. Te informacje pozwalają usługom zarówno poprawić treść, jak i tworzyć lepsze funkcje, które poprawiają doświadczenie użytkownika.",
          cookieTable: {
            headers: { name: "Nazwa", domain: "Usługa", description: "Opis", expiration: "Wygaśnięcie" },
            body: [
              {
                name: googleAnalyticsCookieName,
                domain: "Google Analytics",
                description:
                  'Plik cookie ustawiony przez <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                expiration: "Wygasa po 12 dniach",
              },
              {
                name: googleAnalyticsSessionCookieName,
                domain: "Google Analytics",
                description:
                  'Plik cookie ustawiony przez <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                expiration: "Sesja",
              },
            ],
          },
        },
        advertisement: {
          title: "Reklama",
          description:
            'Google używa plików cookie do reklam, w tym do wyświetlania i renderowania reklam, personalizacji reklam (w zależności od Twoich ustawień reklam na <a href="https://g.co/adsettings">g.co/adsettings</a>), ograniczania liczby wyświetleń reklamy użytkownikowi, wyciszania reklam, które zdecydowałeś się przestać oglądać, oraz mierzenia skuteczności reklam.',
        },
        functionality: {
          title: "Funkcjonalność",
          description:
            "Pliki cookie używane do funkcjonalności umożliwiają użytkownikom interakcję z usługą lub stroną w celu uzyskania dostępu do funkcji, które są fundamentalne dla tej usługi. Do rzeczy uznawanych za fundamentalne dla usługi należą preferencje takie jak wybór języka przez użytkownika, optymalizacje produktu, które pomagają utrzymać i poprawić usługę, oraz utrzymywanie informacji dotyczących sesji użytkownika, takich jak zawartość koszyka zakupów.",
        },
        security: {
          title: "Bezpieczeństwo",
          description:
            "Pliki cookie używane do bezpieczeństwa uwierzytelniają użytkowników, zapobiegają oszustwom i chronią użytkowników podczas interakcji z usługą.",
        },
      },
    },
    categories: {
      [catAnalytics]: {
        services: {
          [serviceAnalyticsStorage]: {
            label: "Umożliwia przechowywanie (np. plików cookie) związane z analityką, np. czas trwania wizyty.",
          },
        },
      },
      [catAdvertisement]: {
        enabled: true,
        readOnly: false,
        services: {
          [serviceAdStorage]: {
            label: "Umożliwia przechowywanie (np. plików cookie) związane z reklamą.",
          },
          [serviceAdUserData]: {
            label: "Ustawia zgodę na wysyłanie danych użytkownika związanych z reklamą do Google.",
          },
          [serviceAdPersonalization]: {
            label: "Ustawia zgodę na personalizację reklam.",
          },
        },
      },
      [catFunctionality]: {
        enabled: true,
        readOnly: false,
        services: {
          [serviceFunctionalityStorage]: {
            label:
              "Umożliwia przechowywanie, które wspiera funkcjonalność strony internetowej lub aplikacji, np. ustawienia języka.",
          },
          [servicePersonalizationStorage]: {
            label: "Umożliwia przechowywanie związane z personalizacją, np. rekomendacje wideo.",
          },
        },
      },
      [catSecurity]: {
        enabled: true,
        readOnly: false,
        services: {
          [serviceSecurityStorage]: {
            label:
              "Umożliwia przechowywanie związane z bezpieczeństwem, takie jak funkcjonalność uwierzytelniania, zapobieganie oszustwom i inna ochrona użytkowników.",
          },
        },
      },
    },
  },
}
