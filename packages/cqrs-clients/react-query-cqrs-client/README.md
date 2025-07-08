# @leancodepl/react-query-cqrs-client

TanStack Query CQRS client with hooks for queries, operations, and commands.

## Features

- **TanStack Query integration** - Built-in caching, optimistic updates, and background refetching
- **CQRS pattern** - Separate queries, commands, and operations with proper typing
- **Custom hooks** - Hook factories for all operation types with loading states
- **Error handling** - Validation errors with custom error codes and handlers
- **Authentication** - Token handling with automatic refresh integration
- **Cache management** - Smart invalidation and query dependency management

## Installation

```bash
npm install @leancodepl/react-query-cqrs-client
# or
yarn add @leancodepl/react-query-cqrs-client
```

## API

### `mkCqrsClient(cqrsEndpoint, queryClient, tokenProvider, ajaxOptions, tokenHeader)`

Creates TanStack Query CQRS client with hooks for queries, operations, and commands.

**Parameters:**

- `cqrsEndpoint: string` - Base URL for CQRS API endpoints
- `queryClient: QueryClient` - TanStack Query client instance
- `tokenProvider?: Partial<TokenProvider>` - Optional token provider for authentication
- `ajaxOptions?: Omit<AjaxConfig, ...>` - Optional RxJS Ajax configuration options
- `tokenHeader?: string` - Header name for authentication token (default: "Authorization")

**Returns:** Object with `createQuery`, `createOperation`, and `createCommand` hook factories

## Usage Examples

### Basic Setup

```typescript
import { mkCqrsClient } from "@leancodepl/react-query-cqrs-client"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()

const client = mkCqrsClient({
    cqrsEndpoint: "https://api.example.com",
    queryClient,
    tokenProvider: {
        getToken: () => Promise.resolve(localStorage.getItem("token")),
    },
})
```

### Query Hook

```typescript
import React from 'react';

interface GetUserQuery {
  userId: string;
}

interface UserResult {
  id: string;
  name: string;
  email: string;
}

const useGetUser = client.createQuery<GetUserQuery, UserResult>('GetUser');

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useGetUser({ userId });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.email}</p>
    </div>
  );
}
```

### Command Hook

```typescript
import React from 'react';

interface CreateUserCommand {
  name: string;
  email: string;
}

const errorCodes = { EmailExists: 1, InvalidEmail: 2 } as const;
const useCreateUser = client.createCommand<CreateUserCommand, typeof errorCodes>('CreateUser', errorCodes);

function CreateUserForm() {
  const { mutate: createUser, isPending } = useCreateUser({
    handler: (handle) =>
      handle('success', () => 'User created successfully')
        .handle('EmailExists', () => 'Email already exists')
        .handle('failure', () => 'Failed to create user')
        .check(),
  });

  const handleSubmit = () => {
    createUser({ name: 'John', email: 'john@example.com' });
  };

  return (
    <button onClick={handleSubmit} disabled={isPending}>
      {isPending ? 'Creating...' : 'Create User'}
    </button>
  );
}
```

### Operation Hook

```typescript
interface UploadFileOperation {
  file: File;
  folder: string;
}

interface UploadResult {
  url: string;
  filename: string;
}

const useUploadFile = client.createOperation<UploadFileOperation, UploadResult>('UploadFile');

function FileUploader() {
  const { mutate: uploadFile, isPending } = useUploadFile({
    invalidateQueries: [['GetFiles']],
  });

  const handleUpload = (file: File) => {
    uploadFile({ file, folder: 'documents' });
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      disabled={isPending}
    />
  );
}
```
