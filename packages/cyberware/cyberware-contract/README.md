# @leancodepl/cyberware-contract

Creates type-safe contracts between a host app and a remote iframe app (e.g., Replit embed). Uses `postMessage` via
Penpal for secure cross-origin communication. Supports **Zod** for defining method params/returns and URL params with
runtime validation and inferred TypeScript types.

## Installation

```bash
npm install @leancodepl/cyberware-contract
```

```bash
yarn add @leancodepl/cyberware-contract
```

## API

### `createContract(options)`

Creates a type-safe contract shared between host and remote. Use the same contract type on both sides to ensure method
signatures match.

**Options:**

- `contractVersion` - **Required.** Semver version of the contract (e.g. `"1.0.0"`). Host passes it via URL params;
  remote verifies before connecting. When using the contract, this value is auto-injected into `useConnectToRemote`,
  `useConnectToHost`, and `ConnectToHostProvider`—you don't pass it explicitly.
- `contractVersionRange` - **Required.** Semver range the host contract version must satisfy (e.g. `">=1.0.0 <2.0.0"`,
  `"^2.0.0"`, `"~2.1.0"`). Remote checks `semver.satisfies(hostVersion, contractVersionRange)` before connecting.

**Returns:** Object with `useConnectToRemote`, `useConnectToHost`, `ConnectToHostProvider`, `useConnectToHostContext`,
and `getUrlParams`

### `ConnectStatus`

Enum for connection state: `ConnectStatus.IDLE`, `ConnectStatus.CONNECTED`, `ConnectStatus.ERROR`,
`ConnectStatus.INCOMPATIBLE`. Used by `useConnectToRemote` and `useConnectToHost` (and context) return values. Check
`status === ConnectStatus.CONNECTED` before using `remote` or `host`; when `status === ConnectStatus.ERROR`, `error` is
set; when `status === ConnectStatus.INCOMPATIBLE` (host connect only), `hostVersion` and `remoteVersion` are set.

### `connectToRemote(iframe, options)`

Connects host (parent) to remote (child iframe). Call from the host app with the iframe element.

**Parameters:**

- `iframe` - `HTMLIFrameElement` - The iframe element to connect to
- `options` - `ConnectToRemoteOptions<THost>` - Connection options

**Returns:** Penpal connection object with `promise` resolving to remote proxy and `destroy` method

### `connectToHost(options)`

Connects remote (child iframe) to host (parent window). Call from the remote app.

**Parameters:**

- `options` - `ConnectToHostOptions<TRemote>` - Connection options

**Returns:** Penpal connection object with `promise` resolving to host proxy and `destroy` method

### `useConnectToRemote(options)`

Connects host (parent) to remote (child iframe) and renders the iframe. Call from the host app.

**Parameters:**

- `options` - `UseConnectToRemoteOptions<THost, TParams>` - Connection options including `remoteUrl`, `iframeProps`
  (with required `title`), `methods`, optional `params`, `allowedOrigins`. `contractVersion` is auto-injected from the
  contract.

**Returns:** `UseConnectToRemoteResult<TRemote>` - Object with `iframe` element and connection state: `status`
(`ConnectStatus`), and when connected `remote` proxy, when error `error`

### `useConnectToHost(options)`

Connects remote (child iframe) to host (parent window). Call from the remote app. Does nothing when not embedded in an
iframe.

**Parameters:**

- `options` - `UseConnectToHostOptions<TRemote>` - Connection options including `methods`, optional `allowedOrigins`.
  `contractVersion` and `contractVersionRange` are auto-injected from the contract.

**Returns:** `UseConnectToHostResult<THost>` - Connection state: `status` (`ConnectStatus`), and when connected `host`
proxy, when error `error`, when incompatible `hostVersion` and `remoteVersion`

### `createConnectToHostProvider()` / `ConnectToHostProvider`

`createConnectToHostProvider` creates a typed `ConnectToHostProvider` and `useConnectToHostContext` pair. Each contract
calls this internally; use `contract.ConnectToHostProvider` and `contract.useConnectToHostContext`.

**ConnectToHostProvider props:** `methods`, optional `allowedOrigins`, `children`. `contractVersion` and
`contractVersionRange` are auto-injected from the contract.

### `buildRemoteUrl(baseUrl, params)`

Builds remote URL with query parameters. Merges params into the URL, preserving existing search params.

**Parameters:**

- `baseUrl` - `string` - Base URL without params
- `params` - `RemoteParamsWithContractVersion` (optional) - Params to merge (must include `contractVersion`)

**Returns:** `string` - Full URL with query string

### `getUrlParams()`

Reads URL search params from the current location as a typed object. No validation is performed. Call from the remote
(iframe) to read params passed by the host. Always uses `location.search` in the browser.

**Returns:** `TParams` - Typed object of params (includes `contractVersion` when using a contract)

### Zod helpers (optional)

When using Zod, you get inferred types and optional runtime validation:

- **`methodDef(def?)`** - Defines a method schema. `def` can have `params` (Zod object) and/or `returns` (Zod type). Use
  for host and remote method signatures.
- **`InferMethodsFromSchema<T>`** - Infers `HostMethods` or `RemoteMethods` from a record of method-def schemas.
- **`InferParamsFromSchema<T>`** - Infers `RemoteParams` from a record of param schemas (e.g. `{ userId: z.string() }`).
- **`MethodType<S>`, `MethodParamsType<S>`, `MethodReturnType<S>`** - Per-method inferred types from a method-def
  schema.
- **`mkZodContractSchema({ hostMethods, remoteMethods, remoteParams })`** - Builds a Zod schema for the full contract
  (e.g. for validation or tooling). Types are still passed to `createContract` via the inferred types.

## Usage Examples

### Shared contract definition (TypeScript only)

Define the contract in a shared package or file used by both host and remote:

```typescript
import { createContract } from "@leancodepl/cyberware-contract"

type HostMethods = {
  navigateTo: (path: string) => Promise<void>
  showNotification: (msg: string, type: "success" | "error") => Promise<void>
}

type RemoteMethods = {
  getCurrentPath: () => Promise<string>
  refresh: () => Promise<void>
}

type RemoteParams = { userId?: string; tenantId?: string }

export const contract = createContract<HostMethods, RemoteMethods, RemoteParams>({
  contractVersion: "1.0.0",
  contractVersionRange: ">=1.0.0 <2.0.0",
})
```

### Shared contract definition (with Zod)

Define method params/returns and URL params with Zod; types are inferred and you can reuse schemas for validation:

```typescript
import { z } from "zod"
import {
  createContract,
  methodDef,
  InferMethodsFromSchema,
  InferParamsFromSchema,
  type HostMethodsSchemaBase,
  type RemoteMethodsSchemaBase,
  type RemoteParamsSchemaBase,
} from "@leancodepl/cyberware-contract"

const NotificationTypeSchema = z.enum(["success", "error", "info"])

const HostMethods = {
  navigateTo: methodDef({ params: z.object({ path: z.string() }) }),
  showNotification: methodDef({
    params: z.object({ message: z.string(), type: NotificationTypeSchema }),
  }),
} satisfies HostMethodsSchemaBase

const RemoteMethods = {
  getCurrentPath: methodDef({ returns: z.string() }),
  refresh: methodDef(),
} satisfies RemoteMethodsSchemaBase

const RemoteParams = {
  userId: z.string(),
  tenantId: z.string().optional(),
} satisfies RemoteParamsSchemaBase

export type HostMethodsType = InferMethodsFromSchema<typeof HostMethods>
export type RemoteMethodsType = InferMethodsFromSchema<typeof RemoteMethods>
export type RemoteParamsType = InferParamsFromSchema<typeof RemoteParams>

export const contract = createContract<HostMethodsType, RemoteMethodsType, RemoteParamsType>({
  contractVersion: "1.0.0",
  contractVersionRange: ">=1.0.0 <2.0.0",
})
```

### Host app: embed remote iframe with React hook

```tsx
import { ConnectStatus } from "@leancodepl/cyberware-contract"
import { contract } from "./contract"

function HostApp() {
  const connection = contract.useConnectToRemote({
    remoteUrl: "https://replit.example.com/app",
    iframeProps: { title: "Remote app" },
    methods: {
      navigateTo: path => router.navigate(path),
      showNotification: (msg, type) => messageApi[type](msg),
    },
    params: { userId: "123", tenantId: "acme" },
  })

  const handleSync = async () => {
    if (connection.status === ConnectStatus.CONNECTED) await connection.remote.refresh()
  }

  return (
    <div>
      {connection.iframe}
      {connection.status === ConnectStatus.CONNECTED && <button onClick={handleSync}>Sync</button>}
    </div>
  )
}
```

### Contract version checking

`contractVersion` and `contractVersionRange` are required in `createContract`. The host passes its version via URL
params to the iframe. The remote verifies compatibility with `semver.satisfies(hostVersion, contractVersionRange)`
before connecting. If versions are incompatible, connection state is `ConnectStatus.INCOMPATIBLE` with `hostVersion` and
`remoteVersion`. When using the contract, version values are auto-injected—no need to pass them to hooks or the
provider.

### Remote app: using ConnectToHostProvider (Recommended)

Wrap the remote app with `ConnectToHostProvider` and use `useConnectToHostContext` in child components to access the
host connection without prop drilling:

```tsx
import { ConnectStatus } from "@leancodepl/cyberware-contract"
import { contract } from "./contract"

function RemoteAppRoot() {
  return (
    <contract.ConnectToHostProvider
      methods={{
        getCurrentPath: () => Promise.resolve(location.pathname),
        refresh: () => refetch(),
      }}>
      <RemoteApp />
    </contract.ConnectToHostProvider>
  )
}

function RemoteApp() {
  const params = contract.getUrlParams()
  const connection = contract.useConnectToHostContext()

  const handleSave = async () => {
    if (connection.status === ConnectStatus.CONNECTED)
      await connection.host.showNotification("Settings saved", "success")
  }

  return (
    <div>
      <p>User: {params.userId}</p>
      {connection.status === ConnectStatus.INCOMPATIBLE && (
        <p>
          Version mismatch: host {connection.hostVersion}, remote {connection.remoteVersion}
        </p>
      )}
      {connection.status === ConnectStatus.CONNECTED && <button onClick={handleSave}>Save</button>}
    </div>
  )
}
```

### Remote app: connect to host and read params

```tsx
import { ConnectStatus } from "@leancodepl/cyberware-contract"
import { contract } from "./contract"

function RemoteApp() {
  const params = contract.getUrlParams()
  const connection = contract.useConnectToHost({
    methods: {
      getCurrentPath: () => Promise.resolve(location.pathname),
      refresh: () => refetch(),
    },
  })

  const handleSave = async () => {
    if (connection.status === ConnectStatus.CONNECTED)
      await connection.host.showNotification("Settings saved", "success")
  }

  return (
    <div>
      <p>User: {params.userId}</p>
      {connection.status === ConnectStatus.INCOMPATIBLE && (
        <p>
          Version mismatch: host {connection.hostVersion}, remote {connection.remoteVersion}
        </p>
      )}
      {connection.status === ConnectStatus.CONNECTED && <button onClick={handleSave}>Save</button>}
    </div>
  )
}
```

### Imperative connection (without React)

Host side:

```typescript
import { connectToRemote, buildRemoteUrl } from "@leancodepl/cyberware-contract"

const iframe = document.getElementById("remote") as HTMLIFrameElement
iframe.src = buildRemoteUrl("https://replit.example.com/app", { contractVersion: "1.0.0", userId: "123" })

const connection = connectToRemote(iframe, {
  methods: {
    navigateTo: path => router.navigate(path),
  },
})
const remote = await connection.promise
await remote.refresh()
```

Remote side:

```typescript
import { connectToHost, getUrlParams } from "@leancodepl/cyberware-contract"

const params = getUrlParams<{ userId?: string }>()
const connection = connectToHost({
  methods: {
    getCurrentPath: () => Promise.resolve(location.pathname),
  },
})
const host = await connection.promise
await host.showNotification("Ready", "success")
```

### Restricting allowed origins

```typescript
connectToHost({
  methods: { getCurrentPath: () => Promise.resolve(location.pathname) },
  allowedOrigins: ["https://my-host-app.com", "https://localhost:3000"],
})
```

## Features

- **Type-safe contracts** - Shared TypeScript types ensure host and remote method signatures stay in sync
- **Zod support** - Optional Zod schemas via `methodDef`, `InferMethodsFromSchema`, and `InferParamsFromSchema` for
  inferred types and reusable validation
- **Contract version checking** - Required `contractVersion` and `contractVersionRange` in `createContract`; remote
  verifies host version satisfies the range via `semver.satisfies` before connecting
- **React hooks** - `useConnectToRemote` and `useConnectToHost` for declarative usage; connection state via
  `ConnectStatus` and discriminated state (`status`, `remote`/`host`, `error`, `hostVersion`/`remoteVersion` when
  incompatible)
- **URL params** - `buildRemoteUrl` and `getUrlParams` pass data from host to remote via query string
- **Origin validation** - Optional `allowedOrigins` restricts which domains can connect
- **Penpal-based** - Uses Penpal for reliable `postMessage` communication across iframe boundaries
