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

## React Host ↔ Flutter Remote

The contract can connect a **React host** to a **Flutter web remote** running inside an iframe. The Zod contract schema
is the single source of truth: TypeScript types are inferred for the React Host side, and
[`@leancodepl/cyberware-contract-generator-dart`](../cyberware-contract-generator-dart) generates Dart extension types
for the Flutter Remote side. The Flutter app uses
[`leancode_flutter_cyberware_contract_base`](https://github.com/nicepage/flutter_corelibrary/tree/main/packages/leancode_flutter_cyberware_contract_base)
for Cubit-based connection state management.

### Example step-by-step setup

#### 1. Create the contract package

The contract package is both an **npm package** (for the React host) and a **Dart package** (for the Flutter remote). It
has both a `package.json` and a `pubspec.yaml`.

**Directory structure:**

```
packages/my-contract/
├── package.json
├── pubspec.yaml
├── cyberware-contract-generator-dart.config.js
├── src/
│   └── lib/
│       ├── contract-schema.ts      # Zod schema (source of truth)
│       ├── contract.ts             # createContract call
│       └── types.ts                # Re-exports inferred TS types
└── lib/
    ├── my_contract.dart            # Dart library barrel file
    ├── generated/                  # Generated Dart files (do not edit)
    │   ├── contract.dart
    │   ├── types.dart
    │   └── connect_to_host.dart
    └── contract/                   # Hand-written Dart glue code
        └── contract.dart           # ConnectToHostCubit wrapper
```

`pubspec.yaml` — declare the package as a Dart package that depends on `leancode_flutter_cyberware_contract_base`:

```yaml
name: my_contract
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.11.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  bloc: ^9.0.0
  flutter_bloc: ^9.0.0
  leancode_flutter_cyberware_contract_base:
    path: <path-to-leancode_flutter_cyberware_contract_base>
  pub_semver: ^2.1.4
  web: ^1.1.0
```

`package.json` — include dev dependencies on `@leancodepl/cyberware-contract`,
`@leancodepl/cyberware-contract-generator-dart`, and `zod`:

```json
{
  "devDependencies": {
    "@leancodepl/cyberware-contract": "*",
    "@leancodepl/cyberware-contract-generator-dart": "*",
    "zod": "^4.1.0"
  }
}
```

#### 2. Define the contract schema

Create the Zod schema in `contract-schema.ts`. This is the single source of truth for both TypeScript and Dart types:

```typescript
import { z } from "zod"
import {
  methodDef,
  mkZodContractSchema,
  type InferMethodsFromSchema,
  type InferParamsFromSchema,
} from "@leancodepl/cyberware-contract"

const RemoteParamsSchema = {
  userId: z.string(),
  theme: z.enum(["light", "dark"]),
}

const HostMethodsSchema = {
  navigateTo: methodDef({ params: z.object({ path: z.string() }) }),
  showNotification: methodDef({
    params: z.object({ message: z.string(), type: z.string().optional() }),
  }),
  getCurrentUserId: methodDef({ returns: z.string().nullable() }),
}

const RemoteMethodsSchema = {
  onRouteChange: methodDef({ params: z.object({ path: z.string() }) }),
  getCurrentPath: methodDef({ returns: z.string() }),
  refresh: methodDef(),
}

export type HostMethods = InferMethodsFromSchema<typeof HostMethodsSchema>
export type RemoteMethods = InferMethodsFromSchema<typeof RemoteMethodsSchema>
export type RemoteParams = InferParamsFromSchema<typeof RemoteParamsSchema>

export const ContractSchema = mkZodContractSchema({
  hostMethods: HostMethodsSchema,
  remoteMethods: RemoteMethodsSchema,
  remoteParams: RemoteParamsSchema,
})
```

Create the contract instance in `contract.ts`:

```typescript
import type { HostMethods, RemoteMethods, RemoteParams } from "./contract-schema"
import { createContract } from "@leancodepl/cyberware-contract"

export const { useConnectToRemote } = createContract<HostMethods, RemoteMethods, RemoteParams>({
  contractVersion: "1.0.0",
  contractVersionRange: ">=1.0.0",
})
```

#### 3. Generate Dart types

Create `cyberware-contract-generator-dart.config.js` in the contract package root:

```javascript
import { ContractSchema } from "./src/lib/contract-schema.ts"

/** @type {import("@leancodepl/cyberware-contract-generator-dart").CyberwareContractGeneratorDartConfig} */
const config = {
  schema: ContractSchema,
  outputDir: "./lib/generated",
}

export default config
```

Run the generator:

```bash
npx cyberware-contract-generator-dart
```

This produces files in `lib/generated/`.

#### 4. Write Dart glue code

Create a `ConnectToHostCubit` wrapper that passes the contract version and wires the generated `connectToHost`:

```dart
// lib/contract/contract.dart

import 'package:leancode_flutter_cyberware_contract_base/leancode_flutter_cyberware_contract_base.dart'
    as base;
import '../generated/connect_to_host.dart';
import '../generated/types.dart';

class ConnectToHostCubitOptions {
  const ConnectToHostCubitOptions({required this.methods});
  final RemoteMethodsBase methods;
}

class ConnectToHostCubit
    extends base.ConnectToHostCubit<RemoteMethodsBase, HostMethods> {
  ConnectToHostCubit(ConnectToHostCubitOptions options)
      : super(base.ConnectToHostCubitOptions(
          connect: () => connectToHost(options.methods),
          contractVersion: '1.0.0',
          contractVersionRange: '>=1.0.0',
        ));
}
```

Create the Dart barrel file `lib/my_contract.dart`:

```dart
export 'generated/connect_to_host.dart';
export 'generated/contract.dart';
export 'generated/types.dart';

export 'contract/contract.dart';
```

#### 5. Set up the Flutter remote

Add the contract package and base package as dependencies in the Flutter app's `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  bloc: ^9.0.0
  flutter_bloc: ^9.0.0
  my_contract:
    path: <path-to-contract-package>
  leancode_flutter_cyberware_contract_base: 1.0.0
```

Add the Penpal bridge script to `web/index.html` **before** the Flutter bootstrap script:

```html
<head>
  <!-- ... -->
  <script src="assets/packages/leancode_flutter_cyberware_contract_base/assets/connect_to_host.js"></script>
</head>
<body>
  <script src="flutter_bootstrap.js" async></script>
</body>
```

Create class implementing the generated `RemoteMethodsBase`. This is where you define how the Flutter app responds to
calls from the host:

```dart
import 'package:flutter/material.dart';
import 'package:my_contract/my_contract.dart';

class AppCyberwareMethods implements RemoteMethodsBase {
  @override
  Future<void> onRouteChange(RemoteOnRouteChangeParams params) {
    debugPrint('Route changed: ${params.path}');
    return Future.value();
  }

  @override
  Future<RemoteGetCurrentPathResult> getCurrentPath() {
    return Future.value('/current-path');
  }

  @override
  Future<RemoteRefreshResult> refresh() {
    return Future.value();
  }
}
```

Use `ConnectToHostCubit` with `BlocProvider` and pass the implementation:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:my_contract/my_contract.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    final params = RemoteUrlParams();

    return BlocProvider<ConnectToHostCubit>(
      create: (_) => ConnectToHostCubit(
        ConnectToHostCubitOptions(
          methods: AppCyberwareMethods(),
        ),
      )..connect(),
      child: MaterialApp(
        home: HomePage(params: params),
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key, required this.params});

  final RemoteUrlParams params;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<ConnectToHostCubit, ConnectToHostState>(
        builder: (context, state) {
          return switch (state) {
            ConnectToHostIdle() => const Center(child: Text('Connecting...')),
            ConnectToHostConnected(:final host) => Column(
                children: [
                  Text('Connected! User: ${params.userId}'),
                  ElevatedButton(
                    onPressed: () => host.showNotification(
                      HostShowNotificationParams(message: 'Hello from Flutter!'),
                    ),
                    child: const Text('Show notification'),
                  ),
                ],
              ),
            ConnectToHostError(:final error) =>
              Center(child: Text('Error: $error')),
            ConnectToHostIncompatible(:final hostVersion, :final remoteVersion) =>
              Center(child: Text('Incompatible: host $hostVersion, remote $remoteVersion')),
          };
        },
      ),
    );
  }
}
```

#### 6. Embed the Flutter remote in the React host

In the React host app, use the contract's `useConnectToRemote` hook to embed the Flutter app in an iframe and implement
the host methods:

```tsx
import { ConnectStatus } from "@leancodepl/cyberware-contract"
import { MyContract, MyContractTypes } from "@my-org/my-contract"

function FlutterAppPage() {
  const methods: MyContractTypes.HostMethods = useMemo(
    () => ({
      navigateTo: ({ path }) => {
        router.navigate(path)
        return Promise.resolve()
      },
      showNotification: ({ message, type }) => {
        notification.open({ content: message })
        return Promise.resolve()
      },
      getCurrentUserId: async () => currentUser?.id ?? null,
    }),
    [],
  )

  const connection = MyContract.useConnectToRemote({
    remoteUrl: "http://localhost:4220",
    methods,
    params: { userId: "demo-user", theme: "light" },
    iframeProps: { title: "Flutter App" },
  })

  return (
    <div>
      {connection.iframe}
      {connection.status === ConnectStatus.CONNECTED && (
        <button onClick={() => connection.remote.refresh()}>Refresh</button>
      )}
    </div>
  )
}
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
- **Flutter remote support** - Generate Dart extension types from the Zod schema with
  `@leancodepl/cyberware-contract-generator-dart`; use `leancode_flutter_cyberware_contract_base` for Cubit-based
  connection state management in Flutter web apps
