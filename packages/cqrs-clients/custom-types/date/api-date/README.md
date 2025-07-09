# @leancodepl/api-date

Type definitions for API date and time handling.

## Installation

```bash
npm install @leancodepl/api-date
# or
yarn add @leancodepl/api-date
```

## API

### `ApiDateOnly`

Type representing date-only values for API communication.

### `ApiDateTime`

Type representing date and time values for API communication.

### `ApiTimeSpan`

Type representing time span values for API communication.

### `ApiTimeOnly`

Type representing time-only values for API communication.

### `ApiDateTimeOffset`

Type representing date and time with offset values for API communication.

## Usage Examples

### Type Definitions

```typescript
import { 
  ApiDateOnly, 
  ApiDateTime, 
  ApiTimeSpan, 
  ApiTimeOnly, 
  ApiDateTimeOffset 
} from '@leancodepl/api-date';

interface UserProfile {
  birthDate: ApiDateOnly;
  createdAt: ApiDateTime;
  sessionDuration: ApiTimeSpan;
  preferredTime: ApiTimeOnly;
  lastLogin: ApiDateTimeOffset;
}
```