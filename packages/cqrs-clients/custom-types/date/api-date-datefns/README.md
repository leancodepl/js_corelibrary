# @leancodepl/api-date-datefns

Date conversion utilities using date-fns for API date types.

## Installation

```bash
npm install @leancodepl/api-date-datefns
# or
yarn add @leancodepl/api-date-datefns
```

## API

### `fromApiDate(date)`

Converts ApiDateOnly to JavaScript Date using date-fns.

**Parameters:**
- `date: ApiDateOnly` - The API date string to convert

**Returns:** JavaScript Date object

### `toApiDate(date)`

Converts JavaScript Date to ApiDateOnly using date-fns.

**Parameters:**
- `date: Date` - The JavaScript Date to convert

**Returns:** ApiDateOnly string

### `fromApiTime(time)`

Converts ApiTimeOnly to JavaScript Date using date-fns.

**Parameters:**
- `time: ApiTimeOnly` - The API time string to convert

**Returns:** JavaScript Date object

### `toApiTime(time)`

Converts JavaScript Date to ApiTimeOnly using date-fns.

**Parameters:**
- `time: Date` - The JavaScript Date to convert

**Returns:** ApiTimeOnly string

### `fromApiDateTimeOffset(dateTimeOffset)`

Converts ApiDateTimeOffset to JavaScript Date using date-fns.

**Parameters:**
- `dateTimeOffset: ApiDateTimeOffset` - The API datetime with offset string to convert

**Returns:** JavaScript Date object

### `toApiDateTimeOffset(dateTimeOffset)`

Converts JavaScript Date to ApiDateTimeOffset using date-fns.

**Parameters:**
- `dateTimeOffset: Date` - The JavaScript Date to convert

**Returns:** ApiDateTimeOffset string

### `fromApiTimeSpan(timeSpan)`

Converts ApiTimeSpan to milliseconds using date-fns.

**Parameters:**
- `timeSpan: ApiTimeSpan` - The API timespan string to convert

**Returns:** Duration in milliseconds

### `toApiTimeSpan(differenceInMilliseconds)`

Converts milliseconds to ApiTimeSpan using date-fns.

**Parameters:**
- `differenceInMilliseconds: number` - The duration in milliseconds to convert

**Returns:** ApiTimeSpan string

## Usage Examples

### Date Conversion

```typescript
import { fromApiDate, toApiDate } from '@leancodepl/api-date-datefns';

const apiDate = '2023-12-25';
const jsDate = fromApiDate(apiDate);
console.log(jsDate); // Date object

const convertedBack = toApiDate(jsDate);
console.log(convertedBack); // '2023-12-25'
```

### Time Conversion

```typescript
import { fromApiTime, toApiTime } from '@leancodepl/api-date-datefns';

const apiTime = '14:30:00';
const jsDate = fromApiTime(apiTime);
const convertedBack = toApiTime(jsDate);
console.log(convertedBack); // '14:30:00'
```

### DateTime with Offset

```typescript
import { fromApiDateTimeOffset, toApiDateTimeOffset } from '@leancodepl/api-date-datefns';

const apiDateTime = '2023-12-25T14:30:00+01:00';
const jsDate = fromApiDateTimeOffset(apiDateTime);
const convertedBack = toApiDateTimeOffset(jsDate);
console.log(convertedBack); // '2023-12-25T14:30:00+01:00'
```
