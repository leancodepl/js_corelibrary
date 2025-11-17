# @leancodepl/api-date-utils

Utilities for parsing and working with API date types.

## Installation

```bash
npm install @leancodepl/api-date-utils
# or
yarn add @leancodepl/api-date-utils
```

## API

### `parseApiTimeSpan(timespan)`

Parses ApiTimeSpan string into structured time components.

**Parameters:**

- `timespan: ApiTimeSpan` - The ApiTimeSpan string to parse

**Returns:** Object with sign and time component values

## Usage Examples

### Basic Parsing

```typescript
import { parseApiTimeSpan } from "@leancodepl/api-date-utils"

const result = parseApiTimeSpan("1.23:45:67.890")
console.log(result.values.hours) // 23
console.log(result.values.days) // 1
console.log(result.sign) // undefined (positive)
```

### Negative TimeSpan

```typescript
import { parseApiTimeSpan } from "@leancodepl/api-date-utils"

const result = parseApiTimeSpan("-2.10:30:45.123")
console.log(result.sign) // '-'
console.log(result.values.days) // 2
console.log(result.values.hours) // 10
console.log(result.values.minutes) // 30
console.log(result.values.milliseconds) // 123
```

### Duration Calculations

```typescript
import { parseApiTimeSpan } from "@leancodepl/api-date-utils"

const calculateTotalMilliseconds = (timespan: ApiTimeSpan) => {
  const parsed = parseApiTimeSpan(timespan)
  const { days, hours, minutes, seconds, milliseconds } = parsed.values

  const total = days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds

  return parsed.sign === "-" ? -total : total
}
```
