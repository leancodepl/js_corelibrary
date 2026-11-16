# @leancodepl/cookie-script

Reads CookieScript consent decisions. The host page loads the CookieScript banner. This package reports whether a
category is granted, denied, or still pending, and subscribes to later choices. It never writes consent.

## Installation

```bash
npm install @leancodepl/cookie-script
# or
yarn add @leancodepl/cookie-script
```

## API

### `cookieScriptAnalyticsCategory`

CookieScript category mapped to Google `analytics_storage`. Value is `"performance"`.

Default category for `getAnalyticsConsent` and `onAnalyticsConsentChange`.

### `getAnalyticsConsent(category)`

Reads whether the visitor has granted a CookieScript category.

Returns `"pending"` until the visitor chooses, `"granted"` when that choice accepted the category, and `"denied"`
otherwise. Prefers the live banner state and falls back to the `CookieScriptConsent` cookie. Never writes consent.

- **Parameters**
  - `category: string` – CookieScript category to check. Defaults to `"performance"`, which CookieScript maps to
    `analytics_storage`
- **Returns**
  - `AnalyticsConsent` – `"granted"`, `"denied"`, or `"pending"`

### `onAnalyticsConsentChange(callback, category)`

Subscribes to CookieScript consent changes and reports the current decision.

Calls back when the banner loads (`"restore"`) and when the visitor accepts or rejects (`"user"`). Also listens for
changes to the consent cookie, because Firefox and Safari can miss the banner events. Re-reads consent on each callback.
Returns an unsubscribe function, or a no-op when `window` is unavailable.

- **Parameters**
  - `callback: (consent: AnalyticsConsent, source: ConsentSource) => void` – Receives the current decision and whether
    it was restored or just chosen. `ConsentSource` is `"user"` or `"restore"`
  - `category: string` – CookieScript category to check. Defaults to `"performance"`
- **Returns**
  - `() => void` – Function that removes the listeners

## Usage Examples

### Read the current analytics decision

```typescript
import { getAnalyticsConsent } from "@leancodepl/cookie-script"

const consent = getAnalyticsConsent()
```

### React when the visitor chooses

```typescript
import { onAnalyticsConsentChange } from "@leancodepl/cookie-script"

const unsubscribe = onAnalyticsConsentChange((consent, source) => {
  console.log(consent, source)
})
```

### Check a category other than analytics

```typescript
import { getAnalyticsConsent } from "@leancodepl/cookie-script"

const marketing = getAnalyticsConsent("marketing")
```
