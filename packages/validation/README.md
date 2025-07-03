# @leancodepl/validation

A TypeScript library for handling validation errors in CQRS command responses.

## Installation

```bash
npm install @leancodepl/validation
# or
yarn add @leancodepl/validation
```

## Overview

This package provides utilities for handling validation errors from CQRS commands and API responses. It allows to chain error handlers and process validation errors in a type-safe way.

## API

### `handleValidationErrors<TAllErrors, TInResult>(validationErrors, errorCodesMap, validationResults?)`

Creates a validation errors handler.

**Parameters:**
- `validationErrors`: Array of `ValidationError<TAllErrors>` objects
- `errorCodesMap`: Object mapping error names to error codes
- `validationResults`: Optional array of previous validation results

**Returns:** `ValidationErrorsHandler<TAllErrors, TInResult>`

### `handleResponse<TErrors>(response, errorCodesMap)`

Handles CQRS command responses and transforms them into validation errors.

**Parameters:**
- `response`: `ApiResponse<CommandResult<TErrors>>` Response from a CQRS command
- `errorCodesMap`: Object mapping error names to error codes

**Returns:** `ValidationErrorsHandler` with additional `success` and `failure` codes of type `SuccessOrFailureMarker`

## Usage Examples

### Basic Error Handling

```typescript
import { handleValidationErrors } from '@leancodepl/validation';

const errorCodesMap = {
  EmailAlreadyExists: 1,
  InvalidEmail: 2,
  PasswordTooWeak: 3,
} as const;

const validationErrors = [
  {
    ErrorCode: 1,
    ErrorMessage: 'Email already exists',
    PropertyName: 'Email',
    AttemptedValue: 'user@example.com',
  },
];

handleValidationErrors(validationErrors, errorCodesMap)
  .handle('EmailAlreadyExists', (errorName, error) => {
    window.alert('This email is already registered');
  })
  .handle('InvalidEmail', (errorName, error) => {
    window.alert('Please enter a valid email address');
  })
  .handle('PasswordTooWeak', (errorName, error) => {
    window.alert('Password must be at least 8 characters long');
  })
  .check();
```

### Multiple Error Types

```typescript
import { handleValidationErrors } from '@leancodepl/validation';

const errorCodesMap = {
  EmailAlreadyExists: 1,
  InvalidEmail: 2,
} as const;

const validationErrors = [
  {
    ErrorCode: 1,
    ErrorMessage: 'Email exists',
    PropertyName: 'Email',
    AttemptedValue: 'user@example.com',
  },
];

// Handle first matching error
handleValidationErrors(validationErrors, errorCodesMap)
  .handle(['EmailAlreadyExists', 'InvalidEmail'], (errorName) => {
    window.alert(
      errorName === 'EmailAlreadyExists' ? 'Email already registered' : 'Invalid email'
    );
  })
  .check();

// Handle all matching errors
handleValidationErrors(validationErrors, errorCodesMap)
  .handleAll(['EmailAlreadyExists', 'InvalidEmail'], (errors) => {
    errors.forEach(({ errorName }) => window.alert(`Error: ${errorName}`));
  })
  .check();
```

### CQRS Commands

```typescript
import { handleResponse } from '@leancodepl/validation';

const errorCodesMap = {
  UserNotFound: 1,
} as const;

const response = await cqrsClient.send(myCommand);

// Basic handling
handleResponse(response, errorCodesMap)
  .handle('success', () => window.alert('Success'))
  .handle('failure', () => window.alert('Failed'))
  .handle('UserNotFound', () => window.alert('User not found'))
  .check();

// With reducer to get boolean result
const isSuccess = handleResponse(response, errorCodesMap)
  .handle(['UserNotFound', 'failure'], () => false)
  .handle('success', () => true)
  .check({
    reducer: (prev, cur) => prev && cur,
    initialValue: true,
  });
```

## Methods

- `.handle(errorTypes, handler)` - Handle first matching error (priority-based)
- `.handleAll(errorTypes, handler)` - Handle all matching errors  
- `.check(reducer?)` - Finalize and optionally reduce results. **Throws error if some codes remain unhandled.**

## Dependencies

- `@leancodepl/cqrs-client-base`: Provides base types for CQRS validation errors 