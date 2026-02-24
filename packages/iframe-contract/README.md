# @leancodepl/iframe-contract

Creates type-safe contracts between a host app and a remote iframe app (e.g., Replit embed). Uses `postMessage` via
Penpal for secure cross-origin communication.

## Installation

```bash
npm install @leancodepl/iframe-contract
```

```bash
yarn add @leancodepl/iframe-contract
```

## API

### `createContract(options)`

Creates a type-safe contract shared between host and remote. Use the same contract type on both sides to ensure method
signatures match.

**Options:**

- `contractVersion` - **Required.** Version string for compatibility checking (e.g. `"1.0.0"`). Host passes it via URL
  params; remote verifies before connecting. When using the contract, this value is auto-injected into
  `useConnectToRemote`, `useConnectToHost`, and `ConnectToHostProvider`—you don't pass it explicitly.
- `isVersionCompatible` - Custom comparator `(hostVersion, remoteVersion) => boolean`. Defaults to semver major match.

**Returns:** Object with `useConnectToRemote`, `useConnectToHost`, `ConnectToHostProvider`, `useConnectToHostContext`,
and `parseUrlParams`

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
  (with required `title`), `methods`, optional `params`, `allowedOrigins`. `contractVersion` is auto-injected from
  the contract.

**Returns:** `UseConnectToRemoteResult<TRemote>` - Object with `iframe` element, `remote` proxy, `isConnected` flag, and
`error`

### `useConnectToHost(options)`

Connects remote (child iframe) to host (parent window). Call from the remote app. Does nothing when not embedded in an
iframe.

**Parameters:**

- `options` - `UseConnectToHostOptions<TRemote>` - Connection options including `methods`, `incompatibleVersionHandler`,
  optional `allowedOrigins`. `contractVersion` and `isVersionCompatible` are auto-injected from the contract.

**Returns:** `UseConnectToHostResult<THost>` - Object with `host` proxy, `isConnected` flag, and `error`

### `createConnectToHostProvider()` / `ConnectToHostProvider`

`createConnectToHostProvider` creates a typed `ConnectToHostProvider` and `useConnectToHostContext` pair. Each contract
calls this internally; use `contract.ConnectToHostProvider` and `contract.useConnectToHostContext`.

**ConnectToHostProvider props:** `methods`, `incompatibleVersionHandler` (required), optional `allowedOrigins`, `children`.
`contractVersion` and `isVersionCompatible` are auto-injected from the contract.

### `buildRemoteUrl(baseUrl, params)`

Builds remote URL with query parameters. Merges params into the URL, preserving existing search params.

**Parameters:**

- `baseUrl` - `string` - Base URL without params
- `params` - `Record<string, string | undefined>` (optional) - Params to merge

**Returns:** `string` - Full URL with query string

### `parseUrlParams(search)`

Parses URL search params into a typed object. Call from the remote (iframe) to read params passed by the host.

**Parameters:**

- `search` - `string` (optional) - Search string (defaults to `location.search` in browser)

**Returns:** `TParams` - Typed object of params (includes `contractVersion` when using a contract)

## Usage Examples

### Shared contract definition

Define the contract in a shared package or file used by both host and remote:

```typescript
import { createContract } from "@leancodepl/iframe-contract"

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
})
```

### Host app: embed remote iframe with React hook

```tsx
import { contract } from "./contract"

function HostApp() {
  const { iframe, remote, isConnected } = contract.useConnectToRemote({
    remoteUrl: "https://replit.example.com/app",
    iframeProps: { title: "Remote app" },
    methods: {
      navigateTo: path => router.navigate(path),
      showNotification: (msg, type) => messageApi[type](msg),
    },
    params: { userId: "123", tenantId: "acme" },
  })

  const handleSync = async () => {
    if (remote) await remote.refresh()
  }

  return (
    <div>
      {iframe}
      {isConnected && <button onClick={handleSync}>Sync</button>}
    </div>
  )
}
```

### Contract version checking

`contractVersion` is required in `createContract`. The host passes it via URL params to the iframe. The remote
verifies compatibility before connecting. If versions are incompatible (default: semver major must match), the
`incompatibleVersionHandler` is called and no connection is established. When using the contract, version values
are auto-injected—no need to pass `contractVersion` to hooks or the provider.

### Remote app: using ConnectToHostProvider (Recommended)

Wrap the remote app with `ConnectToHostProvider` and use `useConnectToHostContext` in child components to access the
host connection without prop drilling:

```tsx
import { contract } from "./contract"

function RemoteAppRoot() {
  return (
    <contract.ConnectToHostProvider
      methods={{
        getCurrentPath: () => Promise.resolve(location.pathname),
        refresh: () => refetch(),
      }}
      incompatibleVersionHandler={(hostVersion, remoteVersion) => {
        console.error(`Version mismatch: host ${hostVersion}, remote ${remoteVersion}`)
      }}>
      <RemoteApp />
    </contract.ConnectToHostProvider>
  )
}

function RemoteApp() {
  const params = contract.parseUrlParams()
  const { host, isConnected } = contract.useConnectToHostContext()

  const handleSave = async () => {
    if (host) await host.showNotification("Settings saved", "success")
  }

  return (
    <div>
      <p>User: {params.userId}</p>
      {isConnected && <button onClick={handleSave}>Save</button>}
    </div>
  )
}
```

### Remote app: connect to host and read params

```tsx
import { contract } from "./contract"

function RemoteApp() {
  const params = contract.parseUrlParams()
  const { host, isConnected } = contract.useConnectToHost({
    methods: {
      getCurrentPath: () => Promise.resolve(location.pathname),
      refresh: () => refetch(),
    },
    incompatibleVersionHandler: (hostVersion, remoteVersion) => {
      console.error(`Version mismatch: host ${hostVersion}, remote ${remoteVersion}`)
    },
  })

  const handleSave = async () => {
    if (host) await host.showNotification("Settings saved", "success")
  }

  return (
    <div>
      <p>User: {params.userId}</p>
      {isConnected && <button onClick={handleSave}>Save</button>}
    </div>
  )
}
```

### Imperative connection (without React)

Host side:

```typescript
import { connectToRemote, buildRemoteUrl } from "@leancodepl/iframe-contract"

const iframe = document.getElementById("remote") as HTMLIFrameElement
iframe.src = buildRemoteUrl("https://replit.example.com/app", { userId: "123" })

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
import { connectToHost, parseUrlParams } from "@leancodepl/iframe-contract"

const params = parseUrlParams<{ userId?: string }>()
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
- **Contract version checking** - Required `contractVersion` in `createContract`; host and remote verify compatibility
  (semver major match by default) before connecting
- **React hooks** - `useConnectToRemote` and `useConnectToHost` for declarative usage
- **URL params** - `buildRemoteUrl` and `parseUrlParams` pass data from host to remote via query string
- **Origin validation** - Optional `allowedOrigins` restricts which domains can connect
- **Penpal-based** - Uses Penpal for reliable `postMessage` communication across iframe boundaries
