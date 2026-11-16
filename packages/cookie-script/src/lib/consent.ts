/**
 * CookieScript category mapped to Google `analytics_storage`.
 *
 * Default category for `getAnalyticsConsent` and `onAnalyticsConsentChange`.
 */
export const cookieScriptAnalyticsCategory = "performance"

/** Consent decision for one CookieScript category. */
export type AnalyticsConsent = "denied" | "granted" | "pending"

/**
 * `"restore"` means a stored choice is being applied on load.
 * `"user"` means the visitor just chose in the banner.
 */
export type ConsentSource = "restore" | "user"

const consentCookieName = "CookieScriptConsent"

/** Fired by CookieScript once its bundle has initialised on the page. */
const loadedEvent = "CookieScriptLoaded"

/** Fired by CookieScript when the visitor interacts with the banner. */
const decisionEvents = ["CookieScriptAccept", "CookieScriptAcceptAll", "CookieScriptReject"] as const

interface CookieScriptState {
  /** Undefined until the visitor has made a choice. */
  action?: "accept" | "reject"
  /** Array from `currentState()`, JSON-encoded string in the cookie. */
  categories?: string | string[]
}

interface CookieScriptInstance {
  currentState(): CookieScriptState
}

declare global {
  interface Window {
    CookieScript?: { instance?: CookieScriptInstance }
  }
}

function normalizeCategories(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((category): category is string => typeof category === "string")
  }
  if (typeof raw === "string") {
    try {
      return normalizeCategories(JSON.parse(raw))
    } catch {
      return []
    }
  }
  return []
}

function readDocumentCookie(): string {
  // CookieScript stores the decision in a document cookie. `cookieStore` is missing in Firefox and Safari.
  return document.cookie
}

function readConsentCookie(): CookieScriptState | null {
  if (typeof document === "undefined") {
    return null
  }
  const prefix = `${consentCookieName}=`
  const entry = readDocumentCookie()
    .split("; ")
    .find(cookie => cookie.startsWith(prefix))
  if (!entry) {
    return null
  }
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(entry.slice(prefix.length)))
    return parsed && typeof parsed === "object" ? (parsed as CookieScriptState) : null
  } catch {
    return null
  }
}

function readConsentState(): CookieScriptState | null {
  if (typeof globalThis.window === "undefined") {
    return null
  }
  // Client code can run before the CookieScript bundle, so fall back to the cookie.
  const live = globalThis.window.CookieScript?.instance?.currentState?.()
  return live ?? readConsentCookie()
}

/**
 * Reads whether the visitor has granted a CookieScript category.
 *
 * Returns `"pending"` until the visitor chooses, `"granted"` when that choice accepted the category, and `"denied"`
 * otherwise. Prefers the live banner state and falls back to the `CookieScriptConsent` cookie. Never writes consent.
 *
 * @param category - CookieScript category to check. Defaults to `"performance"`, which CookieScript maps to `analytics_storage`
 * @returns `"granted"`, `"denied"`, or `"pending"`
 * @example
 * ```typescript
 * const consent = getAnalyticsConsent();
 * ```
 */
export function getAnalyticsConsent(category: string = cookieScriptAnalyticsCategory): AnalyticsConsent {
  const state = readConsentState()
  if (!state?.action) {
    return "pending"
  }
  const granted = state.action === "accept" && normalizeCategories(state.categories).includes(category)
  return granted ? "granted" : "denied"
}

/**
 * Subscribes to CookieScript consent changes and reports the current decision.
 *
 * Calls back when the banner loads (`"restore"`) and when the visitor accepts or rejects (`"user"`). Also listens for
 * changes to the consent cookie, because Firefox and Safari can miss the banner events. Re-reads consent on each
 * callback. Returns an unsubscribe function, or a no-op when `window` is unavailable.
 *
 * @param callback - Receives the current decision and whether it was restored or just chosen
 * @param category - CookieScript category to check. Defaults to `"performance"`
 * @returns Function that removes the listeners
 * @example
 * ```typescript
 * const unsubscribe = onAnalyticsConsentChange((consent, source) => {
 *   console.log(consent, source);
 * });
 * ```
 */
export function onAnalyticsConsentChange(
  callback: (consent: AnalyticsConsent, source: ConsentSource) => void,
  category: string = cookieScriptAnalyticsCategory,
): () => void {
  if (typeof globalThis.window === "undefined") {
    return () => {}
  }

  const handleLoaded = () => callback(getAnalyticsConsent(category), "restore")
  const handleDecision = () => callback(getAnalyticsConsent(category), "user")

  globalThis.addEventListener(loadedEvent, handleLoaded)
  for (const eventName of decisionEvents) {
    globalThis.addEventListener(eventName, handleDecision)
  }

  // `cookieStore` is typed as always present but is missing in Firefox and Safari.
  const cookieStore = globalThis.cookieStore as CookieStore | undefined
  const handleCookieChange = (event: CookieChangeEvent) => {
    const touched = [...event.changed, ...event.deleted]
    if (touched.some(cookie => cookie.name === consentCookieName)) {
      handleDecision()
    }
  }
  cookieStore?.addEventListener("change", handleCookieChange)

  return () => {
    globalThis.removeEventListener(loadedEvent, handleLoaded)
    for (const eventName of decisionEvents) {
      globalThis.removeEventListener(eventName, handleDecision)
    }
    cookieStore?.removeEventListener("change", handleCookieChange)
  }
}
