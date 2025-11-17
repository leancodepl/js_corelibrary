# @leancodepl/login-manager

OAuth2 authentication management with token storage and refresh capabilities.

## Features

- **OAuth2 authentication** - Standard-compliant implementation
- **Multiple storage options** - Local, session, or memory storage
- **Token refresh** - Automatic refresh handling
- **Social login** - Facebook, Google and LinkedIn integrations

## Installation

```bash
npm install @leancodepl/login-manager
# or
yarn add @leancodepl/login-manager
```

## API

### `AsyncLoginManager`

Manages OAuth2 authentication with asynchronous token storage.

**Parameters:**

- `storage: AsyncTokenStorage` - Token storage implementation
- `endpoint: string` - OAuth2 server endpoint
- `clientSecret: string | undefined` - Client secret for authentication
- `clientId: string` - OAuth2 client identifier
- `scopes: string` - Space-separated OAuth2 scopes
- `additionalParams?: Record<string, string>` - Additional OAuth2 parameters

### `SyncLoginManager`

Manages OAuth2 authentication with synchronous token storage.

**Parameters:**

- `storage: SyncTokenStorage` - Token storage implementation
- `endpoint: string` - OAuth2 server endpoint
- `clientSecret: string | undefined` - Client secret for authentication
- `clientId: string` - OAuth2 client identifier
- `scopes: string` - Space-separated OAuth2 scopes
- `additionalParams?: Record<string, string>` - Additional OAuth2 parameters

### `LocalTokenStorage`

Stores OAuth2 tokens in browser localStorage.

**Parameters:**

- `tokenKey?: string` - localStorage key for access token (default: "token")
- `refreshKey?: string` - localStorage key for refresh token (default: "refresh_token")
- `expiryKey?: string` - localStorage key for expiry date (default: "expiration_date")

### `SessionTokenStorage`

Stores OAuth2 tokens in browser sessionStorage.

**Parameters:**

- `tokenKey?: string` - sessionStorage key for access token (default: "token")
- `refreshKey?: string` - sessionStorage key for refresh token (default: "refresh_token")
- `expiryKey?: string` - sessionStorage key for expiry date (default: "expiration_date")

### `MemoryTokenStorage`

Stores OAuth2 tokens in memory.

### `FacebookClient`

Integrates Facebook Login SDK for web applications.

**Parameters:**

- `facebookAppId: string` - Facebook App ID
- `facebookPermissions: string` - Comma-separated Facebook permissions

### `CannotRefreshToken`

Error thrown when token refresh fails.

## Usage Examples

### Basic Authentication

```typescript
import { SyncLoginManager, LocalTokenStorage } from "@leancodepl/login-manager"

const tokenStorage = new LocalTokenStorage()
const loginManager = new SyncLoginManager(
  tokenStorage,
  "https://api.example.com",
  "client_secret",
  "client_id",
  "openid profile email",
)

const result = await loginManager.trySignIn("user@example.com", "password")
if (result.type === "success") {
  console.log("Signed in successfully")
}
```

### Session-based Authentication

```typescript
import { AsyncLoginManager, SessionTokenStorage } from "@leancodepl/login-manager"

const tokenStorage = new SessionTokenStorage()
const loginManager = new AsyncLoginManager(
  tokenStorage,
  "https://api.example.com",
  undefined, // No client secret for public clients
  "public_client_id",
  "openid profile",
)

await loginManager.load()
const isSignedIn = await loginManager.isSigned()
console.log("User signed in:", isSignedIn)
```

### Facebook Login Integration

```typescript
import { FacebookClient, SyncLoginManager, LocalTokenStorage } from "@leancodepl/login-manager"

const facebookClient = new FacebookClient("your-facebook-app-id", "email,public_profile")
const loginManager = new SyncLoginManager(
  new LocalTokenStorage(),
  "https://api.example.com",
  "client_secret",
  "client_id",
  "openid profile",
)

facebookClient.setup()
facebookClient.login(async accessToken => {
  const result = await loginManager.trySignInWithFacebook(accessToken)
  if (result.type === "success") {
    console.log("Facebook login successful")
  }
})
```

### Token Management

```typescript
import { CannotRefreshToken, SyncLoginManager, LocalTokenStorage } from "@leancodepl/login-manager"

const tokenStorage = new LocalTokenStorage()
const loginManager = new SyncLoginManager(
  tokenStorage,
  "https://api.example.com",
  "client_secret",
  "client_id",
  "openid profile",
)

try {
  const token = await loginManager.getToken()
  console.log("Access token:", token)
} catch (error) {
  if (error instanceof CannotRefreshToken) {
    console.log("Token expired, user needs to sign in again")
    await loginManager.signOut()
  }
}
```

### Authentication State Monitoring

```typescript
import { SyncLoginManager, LocalTokenStorage } from "@leancodepl/login-manager"

const tokenStorage = new LocalTokenStorage()
const loginManager = new SyncLoginManager(
  tokenStorage,
  "https://api.example.com",
  "client_secret",
  "client_id",
  "openid profile",
)

loginManager.onChange(isSignedIn => {
  if (isSignedIn) {
    console.log("User is now signed in")
  } else {
    console.log("User signed out")
  }
})
```

### Multiple Authentication Providers

```typescript
import { SyncLoginManager, LocalTokenStorage } from "@leancodepl/login-manager"

const tokenStorage = new LocalTokenStorage()
const loginManager = new SyncLoginManager(
  tokenStorage,
  "https://api.example.com",
  "client_secret",
  "client_id",
  "openid profile",
)

const googleResult = await loginManager.trySignInWithGoogle("google_access_token")
const linkedinResult = await loginManager.trySignInWithLinkedIn("linkedin_access_token")
const otpResult = await loginManager.trySignInWithOneTimeToken("one_time_token")
```
