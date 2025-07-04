# @leancodepl/api-binary

Type-safe binary data handling for API communication.

## Installation

```bash
npm install @leancodepl/api-binary
# or
yarn add @leancodepl/api-binary
```

## API

### `toRaw(apiBinary)`

Converts ApiBinary to raw string representation.

**Parameters:**
- `apiBinary: ApiBinary` - The ApiBinary value to convert

**Returns:** Raw string representation of the binary data

### `fromRaw(apiBinaryRaw)`

Converts raw string to ApiBinary type.

**Parameters:**
- `apiBinaryRaw: ApiBinaryRaw` - The raw string representation to convert

**Returns:** ApiBinary instance from the raw string

## Usage Examples

### Basic Conversion

```typescript
import { fromRaw, toRaw } from '@leancodepl/api-binary';

const binary = fromRaw('SGVsbG8gV29ybGQ=');
const raw = toRaw(binary);
console.log(raw); // 'SGVsbG8gV29ybGQ='
```