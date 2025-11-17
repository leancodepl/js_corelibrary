# @leancodepl/cqrs-client-base

Base types and interfaces for CQRS clients.

## Installation

```bash
npm install @leancodepl/cqrs-client-base
# or
yarn add @leancodepl/cqrs-client-base
```

## API

### `TokenProvider`

Interface for token providers used in CQRS clients.

**Properties:**

- `getToken: () => Promise<string | undefined>` - Returns authentication token
- `invalidateToken: () => Promise<boolean>` - Invalidates and refreshes token

### `ValidationError<TErrorCodes>`

Represents validation errors from commands.

**Properties:**

- `PropertyName: string` - Property that failed validation
- `ErrorMessage: string` - Human-readable error message
- `AttemptedValue: unknown` - Value that was attempted
- `ErrorCode: TErrorCodes[keyof TErrorCodes]` - Error code from provided map

### `CommandResult<TErrorCodes>`

Union type for command results.

**Types:**

- `SuccessfulCommandResult` - When command succeeds
- `FailedCommandResult<TErrorCodes>` - When command fails with validation errors

### `ApiResponse<TResult>`

Union type for API responses.

**Types:**

- `ApiSuccess<TResult>` - Successful response with result
- `ApiError` - Error response

## Usage Examples

### Token Provider Implementation

```typescript
import { TokenProvider } from "@leancodepl/cqrs-client-base"

const tokenProvider: TokenProvider = {
  getToken: async () => {
    return localStorage.getItem("authToken")
  },
  invalidateToken: async () => {
    localStorage.removeItem("authToken")
    return true
  },
}
```

### Command Error Handling

```typescript
import { CommandResult, ValidationError } from "@leancodepl/cqrs-client-base"

interface UserErrorCodes {
  EmailExists: 1
  InvalidEmail: 2
}

function handleCommandResult(result: CommandResult<UserErrorCodes>) {
  if (result.WasSuccessful) {
    console.log("Command succeeded")
  } else {
    result.ValidationErrors.forEach((error: ValidationError<UserErrorCodes>) => {
      console.log(`${error.PropertyName}: ${error.ErrorMessage}`)
    })
  }
}
```

### API Response Handling

```typescript
import { ApiResponse } from "@leancodepl/cqrs-client-base"

function handleApiResponse<T>(response: ApiResponse<T>) {
  if (response.isSuccess) {
    return response.result
  } else {
    throw new Error("API call failed")
  }
}
```
