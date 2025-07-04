# @leancodepl/api-date-dayjs

Date conversion utilities using Day.js for API date types.

## Installation

```bash
npm install @leancodepl/api-date-dayjs
# or
yarn add @leancodepl/api-date-dayjs
```

## API

### `fromApiDate(date)`

Converts ApiDateOnly to Day.js object.

**Parameters:**
- `date: ApiDateOnly` - The API date string to convert

**Returns:** Day.js object

### `toApiDate(date)`

Converts Day.js object to ApiDateOnly.

**Parameters:**
- `date: dayjs.Dayjs` - The Day.js object to convert

**Returns:** ApiDateOnly string

### `fromApiTime(time)`

Converts ApiTimeOnly to Day.js object.

**Parameters:**
- `time: ApiTimeOnly` - The API time string to convert

**Returns:** Day.js object

### `toApiTime(time)`

Converts Day.js object to ApiTimeOnly.

**Parameters:**
- `time: dayjs.Dayjs` - The Day.js object to convert

**Returns:** ApiTimeOnly string

### `fromApiDateTimeOffset(datetime)`

Converts ApiDateTimeOffset to Day.js object.

**Parameters:**
- `datetime: ApiDateTimeOffset` - The API datetime with offset string to convert

**Returns:** Day.js object

### `toApiDateTimeOffset(time)`

Converts Day.js object to ApiDateTimeOffset.

**Parameters:**
- `time: dayjs.Dayjs` - The Day.js object to convert

**Returns:** ApiDateTimeOffset string

### `fromApiTimeSpan(timeSpan)`

Converts ApiTimeSpan to Day.js duration.

**Parameters:**
- `timeSpan: ApiTimeSpan` - The API timespan string to convert

**Returns:** Day.js duration object

### `toApiTimeSpan(duration)`

Converts Day.js duration to ApiTimeSpan.

**Parameters:**
- `duration: duration.Duration` - The Day.js duration object to convert

**Returns:** ApiTimeSpan string

### `dropLocalOffset(time)`

Utility to remove local timezone offset from Day.js object.

**Parameters:**
- `time: dayjs.Dayjs` - The Day.js object to process

**Returns:** Day.js object with UTC offset but keeping local time

## Usage Examples

### Date Conversion

```typescript
import { fromApiDate, toApiDate } from '@leancodepl/api-date-dayjs';
import dayjs from 'dayjs';

const apiDate = '2023-12-25';
const dayjsDate = fromApiDate(apiDate);
console.log(dayjsDate.format('YYYY-MM-DD')); // '2023-12-25'

const convertedBack = toApiDate(dayjsDate);
console.log(convertedBack); // '2023-12-25'
```

### Time Conversion

```typescript
import { fromApiTime, toApiTime } from '@leancodepl/api-date-dayjs';

const apiTime = '14:30:00';
const dayjsTime = fromApiTime(apiTime);
const convertedBack = toApiTime(dayjsTime);
console.log(convertedBack); // '14:30:00'
```

### DateTime with Offset

```typescript
import { fromApiDateTimeOffset, toApiDateTimeOffset } from '@leancodepl/api-date-dayjs';

const apiDateTime = '2023-12-25T14:30:00+01:00';
const dayjsDateTime = fromApiDateTimeOffset(apiDateTime);
const convertedBack = toApiDateTimeOffset(dayjsDateTime);
console.log(convertedBack); // '2023-12-25T14:30:00+01:00'
```

### Timezone Handling

```typescript
import { dropLocalOffset } from '@leancodepl/api-date-dayjs';
import dayjs from 'dayjs';

const localDate = dayjs('2023-12-25T14:30:00');
const utcDate = dropLocalOffset(localDate);
console.log(utcDate.format()); // Date without local offset
```
