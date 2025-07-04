# @leancodepl/rx-cqrs-client

RxJS-based CQRS client for reactive command and query operations.

## Features

- **RxJS integration** - Reactive streams with operators for real-time data handling
- **CQRS pattern** - Separate queries, commands, and operations with proper typing
- **Observable operations** - Stream-based data handling with composable operators
- **Error handling** - Validation errors with custom error codes and stream operators
- **Authentication** - Token handling with automatic refresh and retry logic
- **Custom operators** - Command response handling and stream transformation utilities

## Installation

```bash
npm install @leancodepl/rx-cqrs-client
# or
yarn add @leancodepl/rx-cqrs-client
```

## API

### `mkCqrsClient(cqrsEndpoint, tokenProvider, ajaxOptions, tokenHeader)`

Creates CQRS client for command and query operations.

**Parameters:**
- `cqrsEndpoint: string` - Base URL for CQRS API endpoints
- `tokenProvider?: TokenProvider` - Optional token provider for authentication
- `ajaxOptions?: Omit<AjaxConfig, ...>` - Optional RxJS Ajax configuration options
- `tokenHeader?: string` - Header name for authentication token (default: "Authorization")

**Returns:** Object with `createQuery`, `createOperation`, and `createCommand` observable factories

### `handleCommandResponse(handlerFunc)`

Handles command responses with RxJS operators for validation error processing.

**Parameters:**
- `handlerFunc: Function` - Function that processes validation error handlers

**Returns:** RxJS operator function for handling command responses

### `reduceBoolean()`

Reduces boolean values in RxJS streams using logical AND operation.

**Returns:** RxJS operator function that reduces boolean values

### `reduceObject()`

Reduces object values in RxJS streams by merging properties.

**Returns:** RxJS operator function that reduces object values

## Usage Examples

### Basic Setup

```typescript
import { mkCqrsClient } from '@leancodepl/rx-cqrs-client';

const client = mkCqrsClient({
  cqrsEndpoint: 'https://api.example.com',
  tokenProvider: {
    getToken: () => Promise.resolve(localStorage.getItem('token')),
    invalidateToken: () => Promise.resolve(true)
  }
});
```

### Query Operations

```typescript
import { switchMap } from 'rxjs/operators';

interface GetUserQuery {
  userId: string;
}

interface UserResult {
  id: string;
  name: string;
  email: string;
}

const getUser = client.createQuery<GetUserQuery, UserResult>('GetUser');

getUser({ userId: '123' }).subscribe({
  next: (user) => console.log('User:', user),
  error: (error) => console.error('Error:', error)
});
```

### Command Operations

```typescript
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface CreateUserCommand {
  name: string;
  email: string;
}

const errorCodes = { EmailExists: 1, InvalidEmail: 2 } as const;
const createUser = client.createCommand<CreateUserCommand, typeof errorCodes>('CreateUser', errorCodes);

createUser.handle({ name: 'John', email: 'john@example.com' })
  .handle('success', () => console.log('User created'))
  .handle('EmailExists', () => console.log('Email already exists'))
  .handle('failure', () => console.log('Creation failed'))
  .check();
```

### Reactive Patterns

```typescript
import { fromEvent, switchMap, debounceTime } from 'rxjs';

const searchInput = document.getElementById('search') as HTMLInputElement;

fromEvent(searchInput, 'input')
  .pipe(
    debounceTime(300),
    switchMap((event) => {
      const query = (event.target as HTMLInputElement).value;
      return client.createQuery('SearchUsers')({ query });
    })
  )
  .subscribe(results => {
    console.log('Search results:', results);
  });
```
