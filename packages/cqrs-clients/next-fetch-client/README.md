# @leancodepl/next-fetch-client

CQRS client using native fetch API for Next.js applications with automatic response uncapitalization.

## Features

- **Native fetch API** - No external HTTP dependencies, optimized for Next.js server and client components
- **CQRS pattern** - Separate queries, commands, and operations with proper typing
- **Automatic uncapitalization** - Response keys automatically transformed from PascalCase to camelCase
- **Query abort support** - Built-in AbortController for query cancellation
- **Authentication** - Token handling with automatic refresh and retry logic
- **Next.js cache integration** - Respects Next.js fetch caching semantics

## Installation

```bash
npm install @leancodepl/next-fetch-client
# or
yarn add @leancodepl/next-fetch-client
```

## API

### `mkCqrsClient(params)`

Creates CQRS client using native fetch API for Next.js applications with automatic response uncapitalization.

**Parameters:**

- `params: MkCqrsClientParameters` - Configuration object for CQRS client

**Returns:** Object with `createQuery`, `createOperation`, and `createCommand` factories

### `MkCqrsClientParameters`

Configuration options for the CQRS client.

**Properties:**

- `cqrsEndpoint: string` - Base URL for CQRS API endpoints
- `tokenProvider?: TokenProvider` - Optional token provider for authentication
- `fetchOptions?: Omit<RequestInit, "body" | "headers" | "method">` - Optional fetch configuration options
- `tokenHeader?: string` - Header name for authentication token (default: "Authorization")

## Usage Examples

### Basic Setup

```typescript
import { mkCqrsClient } from "@leancodepl/next-fetch-client"

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

### Aborting Queries

```typescript
const getUser = client.createQuery<GetUserQuery, UserResult>("GetUser")

const queryPromise = getUser({ userId: "123" })

// Abort the request if needed
queryPromise.abort()

const response = await queryPromise

if (!response.isSuccess && response.isAborted) {
  console.log("Query was aborted")
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

if (response.isSuccess) {
  console.log("Command result:", response.result)
}

// Using the handle method for validation
createUser
  .handle({ name: "John", email: "john@example.com" })
  .then(handler =>
    handler
      .handle("success", () => console.log("User created"))
      .handle("EmailExists", () => console.log("Email already exists"))
      .handle("failure", () => console.log("Creation failed"))
      .check(),
  )
```

### Operation Requests

```typescript
interface ProcessPaymentOperation {
  orderId: string
  amount: number
}

interface PaymentResult {
  transactionId: string
  status: string
}

const processPayment = client.createOperation<ProcessPaymentOperation, PaymentResult>("ProcessPayment")

const response = await processPayment({ orderId: "order-123", amount: 99.99 })

if (response.isSuccess) {
  console.log("Transaction:", response.result.transactionId)
}
```

### Next.js Server Component

```typescript
import { mkCqrsClient } from "@leancodepl/next-fetch-client"

const client = mkCqrsClient({
  cqrsEndpoint: process.env.API_URL!,
  fetchOptions: {
    next: { revalidate: 60 },
  },
})

const getProducts = client.createQuery<{}, ProductsResult>("GetProducts")

export default async function ProductsPage() {
  const response = await getProducts({})

  if (!response.isSuccess) {
    return <div>Error loading products</div>
  }

  return (
    <ul>
      {response.result.products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

### Custom Fetch Options

```typescript
const client = mkCqrsClient({
  cqrsEndpoint: "https://api.example.com",
  fetchOptions: {
    credentials: "include",
    next: { revalidate: 3600 },
  },
  tokenHeader: "X-Auth-Token",
})
```
