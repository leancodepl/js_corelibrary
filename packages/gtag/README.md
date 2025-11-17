# @leancodepl/gtag

Type-safe Google Tag Manager data layer integration.

## Installation

```bash
npm install @leancodepl/gtag
# or
yarn add @leancodepl/gtag
```

## API

### `mkgtag()`

Creates a type-safe Google Tag Manager data layer push function.

**Returns:** Function that accepts data layer arguments and pushes to GTM

## Usage Examples

### Basic Event Tracking

```typescript
import { mkgtag } from "@leancodepl/gtag"

const gtag = mkgtag<{ event: "page_view"; page_title: string }>()

gtag({
  event: "page_view",
  page_title: "Home Page",
})
```

### Custom Events with Callbacks

```typescript
import { mkgtag } from "@leancodepl/gtag"

interface CustomEvent {
  event: "button_click"
  element_id: string
}

const gtag = mkgtag<CustomEvent>()

gtag({
  event: "button_click",
  element_id: "signup-button",
  eventCallback: containerId => {
    console.log("Event sent to container:", containerId)
  },
  eventTimeout: 2000,
})
```
