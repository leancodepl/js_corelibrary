# @leancodepl/validation

TypeScript library for handling validation errors in CQRS command responses with type-safe error code mapping.

## Installation

```bash
npm install @leancodepl/validation
# or
yarn add @leancodepl/validation
```

## API

### `handleValidationErrors(validationErrors, errorCodesMap, validationResults)`

Creates a validation error handler that processes errors with type-safe error code mapping.

**Parameters:**

- `validationErrors: ValidationError<TAllErrors>[]` - Array of validation errors to process
- `errorCodesMap: TAllErrors` - Mapping of error names to numeric codes
- `validationResults?: TInResult[]` - Optional array of previous handler results

**Returns:** Handler with `handle`, `handleAll`, and `check` methods

### `handleResponse(response, errorCodesMap)`

Handles CQRS command responses and transforms them into validation error handlers.

**Parameters:**

- `response: ApiResponse<CommandResult<TErrors>>` - API response containing command result
- `errorCodesMap: TErrors` - Mapping of error names to numeric codes

**Returns:** Validation error handler with success/failure support

## Usage Examples

### Basic Error Handling

```typescript
import { handleValidationErrors } from "@leancodepl/validation"

const errorCodes = { EmailExists: 1, InvalidEmail: 2 } as const
const errors = [
    { ErrorCode: 1, ErrorMessage: "Email exists", PropertyName: "Email", AttemptedValue: "user@example.com" },
]

handleValidationErrors(errors, errorCodes)
    .handle("EmailExists", () => console.log("Email already registered"))
    .handle("InvalidEmail", () => console.log("Invalid email format"))
    .check()
```

### Command Response Handling

```typescript
import { handleResponse } from "@leancodepl/validation"

const errorCodes = { UserNotFound: 1 } as const
const response = await fetch("/api/users/123", { method: "PUT", body: JSON.stringify({ name: "John" }) })

handleResponse(response, errorCodes)
    .handle("success", () => console.log("User updated"))
    .handle("UserNotFound", () => console.log("User not found"))
    .handle("failure", () => console.log("Request failed"))
    .check()
```

### Multiple Error Handling

```typescript
import { handleValidationErrors } from "@leancodepl/validation"

const errorCodes = { Required: 1, Invalid: 2 } as const
const errors = [
    { ErrorCode: 1, PropertyName: "email", ErrorMessage: "Email required" },
    { ErrorCode: 2, PropertyName: "name", ErrorMessage: "Invalid name" },
]

handleValidationErrors(errors, errorCodes)
    .handleAll(["Required", "Invalid"], errorGroups => {
        errorGroups.forEach(({ errors }) => {
            errors.forEach(error => console.log(`${error.PropertyName}: ${error.ErrorMessage}`))
        })
    })
    .check()
```

### Success/Failure Result Processing

```typescript
import { handleResponse } from "@leancodepl/validation"

const errorCodes = { InvalidData: 1 } as const
const response = await fetch("/api/data")

const isSuccess = handleResponse(response, errorCodes)
    .handle("success", () => true)
    .handle(["InvalidData", "failure"], () => false)
    .check({
        reducer: (prev, current) => prev && current,
        initialValue: true,
    })
```
