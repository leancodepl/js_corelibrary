# @leancodepl/axios-cqrs-client

CQRS client with Axios for HTTP communication and command/query handling.

## Installation

```bash
npm install @leancodepl/axios-cqrs-client
# or
yarn add @leancodepl/axios-cqrs-client
```

## API

### `mkCqrsClient(cqrsEndpoint, tokenProvider, axiosOptions, tokenHeader)`

Creates CQRS client with Axios for HTTP communication and command/query handling.

**Parameters:**

- `cqrsEndpoint: string` - Base URL for CQRS API endpoints
- `tokenProvider?: TokenProvider` - Optional token provider for authentication
- `axiosOptions?: CreateAxiosDefaults` - Optional Axios configuration options
- `tokenHeader?: string` - Header name for authentication token (default: "Authorization")

**Returns:** Object with `createQuery`, `createOperation`, and `createCommand` methods

### `mkUncapitalizedCqrsClient(params)`

Creates CQRS client with automatic response key uncapitalization using "@leancodepl/utils".

**Parameters:**

- `params: MkCqrsClientParameters` - Configuration object for CQRS client
- `params.cqrsEndpoint: string` - Base URL for CQRS API endpoints
- `params.tokenProvider?: TokenProvider` - Optional token provider for authentication
- `params.axiosOptions?: CreateAxiosDefaults` - Optional Axios configuration options
- `params.tokenHeader?: string` - Header name for authentication token (default: "Authorization")

**Returns:** CQRS client with response key transformation

## Usage Examples

### Basic Setup

```typescript
import { mkCqrsClient } from "@leancodepl/axios-cqrs-client"

const client = mkCqrsClient({
    cqrsEndpoint: "https://api.example.com",
    tokenProvider: {
        getToken: () => Promise.resolve(localStorage.getItem("token")),
        invalidateToken: () => Promise.resolve(true),
    },
})
```

### Query Operations

```typescript
interface GetUserQuery {
    userId: string
}

interface UserResult {
    id: string
    name: string
    email: string
}

const getUser = client.createQuery<GetUserQuery, UserResult>("GetUser")

const response = await getUser({ userId: "123" })

if (response.isSuccess) {
    console.log("User:", response.result)
}
```

### Command Operations

```typescript
interface CreateUserCommand {
    name: string
    email: string
}

const errorCodes = { EmailExists: 1, InvalidEmail: 2 } as const
const createUser = client.createCommand<CreateUserCommand, typeof errorCodes>("CreateUser", errorCodes)

const response = await createUser({ name: "John", email: "john@example.com" })

createUser
    .handle({ name: "John", email: "john@example.com" })
    .handle("success", () => console.log("User created"))
    .handle("EmailExists", () => console.log("Email already exists"))
    .check()
```

### Uncapitalized Client

```typescript
import { mkUncapitalizedCqrsClient } from "@leancodepl/axios-cqrs-client"

const client = mkUncapitalizedCqrsClient({
    cqrsEndpoint: "https://api.example.com",
})

// Automatically transforms { UserId: '123' } to { userId: '123' }
const response = await client.createQuery("GetUser")({ userId: "123" })
```
