# @leancodepl/kratos

Headless React components library for building Ory Kratos authentication flows.

## Installation

```bash
npm install @leancodepl/kratos
# or
yarn add @leancodepl/kratos
```

## API

### `mkKratos(queryClient, basePath, traits, SessionManager)`

Creates a Kratos client factory with authentication flows, session management, and React providers.

**Parameters:**

- `queryClient: QueryClient` - React Query client instance for managing server state
- `basePath: string` - Base URL for the Kratos API server
- `traits?: TTraitsConfig` - Optional traits configuration object for user schema validation
- `SessionManager?: new (props: BaseSessionManagerContructorProps) => TSessionManager` - Optional session manager
  constructor, defaults to BaseSessionManager

**Returns:** Object with the following structure:

#### `flows`

Authentication flow components and hooks:

- `useLogout()` - Hook providing logout functionality with optional returnTo parameter
- `LoginFlow` - Complete login flow component with multi-step authentication support
- `RecoveryFlow` - Password recovery flow component with email verification and reset
- `RegistrationFlow` - User registration flow component with traits collection and verification
- `SettingsFlow` - User settings flow component for account management and profile updates
- `VerificationFlow` - Email verification flow component

#### `providers`

React context providers for the application:

- `KratosProviders` - Composite provider that wraps your app with necessary Kratos context
  - Includes `KratosClientProvider` for API access
  - Includes `KratosSessionProvider` for session management

#### `session`

Session management utilities:

- `sessionManager` - Session manager instance with methods and hooks for:
  - **Async Methods**: `getSession()`, `getIdentity()`, `getUserId()`, `isLoggedIn()`, `checkIfLoggedIn()`
  - **React Hooks**: `useSession()`, `useIdentity()`, `useUserId()`, `useIsLoggedIn()`, `useIsAal2Required()`
  - **Extensible**: Can be extended to provide trait-specific methods like `useEmail()`, `useFirstName()` for typed user
    data access

### `BaseSessionManager(queryClient, api)`

Manages Ory Kratos session and identity state with React Query integration.

**Parameters:**

- `queryClient: QueryClient` - React Query `QueryClient` instance for caching and fetching session data
- `api: FrontendApi` - Ory Kratos `FrontendApi` instance for session and identity requests

## Usage Examples

### Basic Setup

```typescript
// services/kratos.ts

import { queryClient } from "./query.ts"

const traitsConfig = {
  Email: { trait: "email", type: "string" },
  GivenName: { trait: "given_name", type: "string" },
  RegulationsAccepted: { trait: "regulations_accepted", type: "boolean" },
} as const

const { session, providers, flows } = mkKratos({
  queryClient,
  basePath: "https://auth.example.com/.ory",
  traits: traitsConfig,
})

// session
export const sessionManager = session.sessionManager

// providers
export const KratosProviders = providers.KratosProviders

// flows
export const RegistrationFlow = flows.RegistrationFlow
export const LoginFlow = flows.LoginFlow
export const RecoveryFlow = flows.RecoveryFlow
export const SettingsFlow = flows.SettingsFlow
export const VerificationFlow = flows.VerificationFlow
export const useLogout = flows.useLogout
```

```typescript
// main.tsx

import { QueryClientProvider } from "@tanstack/react-query"
import { KratosProviders } from "./services/kratos"
import { queryClient } from "./services/query"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KratosProviders>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </KratosProviders>
    </QueryClientProvider>
  );
}
```

### Session Management

```typescript
import { sessionManager } from "../services/kratos";

function UserProfile() {
  const { isLoggedIn, isLoading } = sessionManager.useIsLoggedIn();
  const { userId } = sessionManager.useUserId();
  const { email } = sessionManager.useEmail();
  const { firstName } = sessionManager.useFirstName();

  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Not logged in</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {userId}</p>
      <p>Email: {email}</p>
      <p>Name: {firstName}</p>
    </div>
  );
}
```

### Login Flow

```typescript
import { LoginFlow } from "../services/kratos";
import { useNavigate } from "@tanstack/react-router";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <LoginFlow
      chooseMethodForm={ChooseMethodForm}
      secondFactorForm={SecondFactorForm}
      secondFactorEmailForm={SecondFactorEmailForm}
      emailVerificationForm={EmailVerificationForm}
      returnTo="/identity"
      onLoginSuccess={() => console.log("Login successful")}
      onSessionAlreadyAvailable={() => navigate({ to: "/identity" })}
      onError={({ target, errors }) => {
        console.error(`Error in ${target}:`, errors);
      }}
    />
  );
}
```

### Registration Flow

```typescript
import { RegistrationFlow } from "../services/kratos";
import type { AuthTraitsConfig } from "../services/kratos";

function RegisterPage() {
  return (
    <RegistrationFlow
      chooseMethodForm={ChooseMethodForm}
      emailVerificationForm={EmailVerificationForm}
      traitsForm={TraitsForm}
      returnTo="/welcome"
      onRegistrationSuccess={() => console.log("Registration successful")}
      onVerificationSuccess={() => console.log("Email verified")}
      onError={({ target, errors }) => {
        console.error(`Registration error in ${target}:`, errors);
      }}
    />
  );
}
```

### Settings Flow

```typescript
import { SettingsFlow } from "../services/kratos";

function SettingsPage() {
  const { isLoggedIn, isLoading } = sessionManager.useIsLoggedIn();

  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Access denied</div>;

  return (
    <SettingsFlow
      newPasswordForm={NewPasswordForm}
      traitsForm={TraitsForm}
      passkeysForm={PasskeysForm}
      totpForm={TotpForm}
      oidcForm={OidcForm}
      settingsForm={({ traitsForm, newPasswordForm, passkeysForm }) => (
        <div>
          {traitsForm}
          {newPasswordForm}
          {passkeysForm}
        </div>
      )}
      onChangePasswordSuccess={() => console.log("Password updated")}
      onChangeTraitsSuccess={() => console.log("Profile updated")}
    />
  );
}
```

### Logout Functionality

```typescript
import { useLogout } from "../services/kratos";

function LogoutButton() {
  const { logout } = useLogout();

  const handleLogout = async () => {
    const result = await logout({ returnTo: "/login" });
    if (result.isSuccess) {
      console.log("Logout successful");
    } else {
      console.error("Logout failed:", result.error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Recovery Flow

```typescript
import { RecoveryFlow } from "../services/kratos";

function RecoveryPage() {
  return (
    <RecoveryFlow
      emailForm={EmailForm}
      codeForm={CodeForm}
      newPasswordForm={NewPasswordForm}
      onRecoverySuccess={() => console.log("Password recovery completed")}
      onError={(error) => console.error("Recovery failed:", error)}
    />
  );
}
```

### Custom Error Handling

```typescript
import { AuthError } from "@leancodepl/kratos"

function getErrorMessage(error: AuthError) {
  switch (error.id) {
    case "Error_InvalidCredentials":
      return "Invalid email or password"
    case "Error_MissingProperty":
      return "This field is required"
    case "Error_TooShort":
      return "Password is too short"
    default:
      return "An error occurred"
  }
}

function handleError({ target, errors }) {
  if (target === "root") {
    console.error("Form errors:", errors.map(getErrorMessage))
  } else {
    console.error(`Field ${target} errors:`, errors.map(getErrorMessage))
  }
}
```

### Implementing form of an example flow

```typescript
import { RegistrationFlow } from "../services/kratos";
import type { AuthTraitsConfig } from "../services/kratos";

function RegisterPage() {
  return (
    <RegistrationFlow
      chooseMethodForm={ChooseMethodForm}
    />
  );
}

function ChooseMethodForm({
  errors,
  ReturnToTraitsForm,
  Password,
  PasswordConfirmation,
  Passkey,
  isSubmitting,
  isValidating,
}: registrationFlow.ChooseMethodFormProps) {
  return (
    <div>
      {ReturnToTraitsForm && (
        <ReturnToTraitsForm>
          <button>
            Return
          </button>
        </ReturnToTraitsForm>
      )}
      {Password && (
        <Password>
          <input placeholder="Password" />
        </Password>
      )}
      {PasswordConfirmation && (
        <PasswordConfirmation>
          <input placeholder="Password confirmation" />
        </PasswordConfirmation>
      )}

      <button type="submit">
        Register
      </button>

      {Passkey && (
        <Passkey>
          <button>
            Sign up with Passkey
          </button>
        </Passkey>
      )}

      {errors && errors.length > 0 && (
        <div>
          {errors.map(error => (
            <div key={error.id}>{getErrorMessage(error)}</div>
          ))}
        </div>
      )}
    </div>
  )
}
```
