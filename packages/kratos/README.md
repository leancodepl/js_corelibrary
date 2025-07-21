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

To use the library, you need to create new instance of Kratos client with `mkKratos` factory:

```typescript
// kratosService.ts

import { queryClient } from "./queryService"

const traitsConfig = {
  Email: { trait: "email", type: "string" },
  GivenName: { trait: "given_name", type: "string" },
  RegulationsAccepted: { trait: "regulations_accepted", type: "boolean" },
} as const

const {
  session: { sessionManager },
  providers: { KratosProviders },
  flows: { LoginFlow, RegistrationFlow, SettingsFlow, VerificationFlow, RecoveryFlow, useLogout },
} = mkKratos({
  queryClient,
  basePath: environment.authUrl,
  traits: traitsConfig,
})

// session
export { sessionManager }

// providers
export { KratosProviders }

// flows
export { LoginFlow, RecoveryFlow, RegistrationFlow, SettingsFlow, useLogout, VerificationFlow }

// traits
export type AuthTraitsConfig = typeof traitsConfig
```

And then wrap your app with `KratosProviders` from `mkKratos`:

```tsx
// main.tsx

import { QueryClientProvider } from "@tanstack/react-query"
import { KratosProviders } from "./kratosService"
import { queryClient } from "./queryService"

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
  )
}
```

### Session Management

```tsx
import { sessionManager } from "./kratosService"

function UserProfile() {
  const { isLoggedIn, isLoading } = sessionManager.useIsLoggedIn()
  const { userId } = sessionManager.useUserId()
  const { email } = sessionManager.useEmail()
  const { firstName } = sessionManager.useFirstName()

  if (isLoading) return <div>Loading...</div>
  if (!isLoggedIn) return <div>Not logged in</div>

  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {userId}</p>
      <p>Email: {email}</p>
      <p>Name: {firstName}</p>
    </div>
  )
}
```

### Login Flow

```tsx
import { LoginFlow } from "./kratosService"

function LoginPage() {
  return (
    <LoginFlow
      chooseMethodForm={ChooseMethodForm}
      secondFactorForm={SecondFactorForm}
      secondFactorEmailForm={SecondFactorEmailForm}
      emailVerificationForm={EmailVerificationForm}
      returnTo="/identity"
      onLoginSuccess={() => {
        console.log("Login successful")
      }}
      onSessionAlreadyAvailable={() => {
        location.href = "/identity"
      }}
      onError={({ target, errors }) => {
        console.error(`Error in ${target}:`, errors)
      }}
    />
  )
}
```

### Registration Flow

```tsx
import { RegistrationFlow } from "./kratosService"

function RegisterPage() {
  return (
    <RegistrationFlow
      chooseMethodForm={ChooseMethodForm}
      emailVerificationForm={EmailVerificationForm}
      traitsForm={TraitsForm}
      returnTo="/welcome"
      onRegistrationSuccess={() => {
        console.log("Registration successful")
      }}
      onVerificationSuccess={() => {
        console.log("Email verified")
      }}
      onError={({ target, errors }) => {
        console.error(`Registration error in ${target}:`, errors)
      }}
    />
  )
}
```

### Settings Flow

```tsx
import { SettingsFlow } from "./kratosService"

function SettingsPage() {
  const { isLoggedIn, isLoading } = sessionManager.useIsLoggedIn()

  if (isLoading) return <div>Loading...</div>
  if (!isLoggedIn) return <div>Access denied</div>

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
      onChangePasswordSuccess={() => {
        console.log("Password updated")
      }}
      onChangeTraitsSuccess={() => {
        console.log("Profile updated")
      }}
    />
  )
}
```

### Logout Functionality

```tsx
import { useLogout } from "./kratosService"

function LogoutButton() {
  const { logout } = useLogout()

  const handleLogout = async () => {
    const result = await logout({ returnTo: "/login" })
    if (result.isSuccess) {
      console.log("Logout successful")
    } else {
      console.error("Logout failed:", result.error)
    }
  }

  return <button onClick={handleLogout}>Logout</button>
}
```

### Recovery Flow

```tsx
import { RecoveryFlow } from "./kratosService"

function RecoveryPage() {
  return (
    <RecoveryFlow
      emailForm={EmailForm}
      codeForm={CodeForm}
      newPasswordForm={NewPasswordForm}
      onRecoverySuccess={() => {
        console.log("Password recovery completed")
      }}
      onError={error => {
        console.error("Recovery failed:", error)
      }}
    />
  )
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

### Implementing flow form

Each form in every flow exposes [slot components](https://www.radix-ui.com/primitives/docs/utilities/slot) for inputs
and buttons. When wrapping your custom components with these slots, relevant props (such as the `onInput` event handler)
are automatically applied. If you use a custom component as a child, you receive props from one of the following types:
`CommonInputFieldProps`, `CommonCheckboxFieldProps`, or `CommonButtonProps`.

Forms like `TraitsForm` have dynamic parameters determined by the `traitsConfig` you provide to the `mkKratos` factory.
To type these correctly, use a generic such as `registrationFlow.TraitsFormProps<AuthTraitsConfig>` and pass your traits
config.

Some forms are typed as discriminated unions with multiple variants.

#### Custom Input component with CommonInputFieldProps

```tsx
import { CommonInputFieldProps } from "@leancodepl/kratos"
import { getErrorMessage } from "./kratosService"

type InputProps = CommonInputFieldProps & { placeholder?: string }

export const Input = ({ errors, ...props }: InputProps) => (
  <div>
    <input {...props} />
    {errors && errors.length > 0 && (
      <div>
        {errors.map(error => (
          <div key={error.id}>{getErrorMessage(error)}</div>
        ))}
      </div>
    )}
  </div>
)
```

#### ChooseMethodForm in login flow

```tsx
import { loginFlow } from "@leancodepl/kratos"
import { LoginFlow, getErrorMessage } from "./kratosService"
import type { AuthTraitsConfig } from "./kratosService"

function LoginPage() {
  return (
    <LoginFlow
      chooseMethodForm={ChooseMethodForm}
      // other props
    />
  )
}

function ChooseMethodForm(props: loginFlow.ChooseMethodFormProps) {
  if (props.isLoading) {
    return <p>Loading login methods...</p>
  }

  const { Password, Google, Passkey, Apple, Facebook, errors, isSubmitting, isValidating } = props

  if (props.isRefresh) {
    const { identifier } = props

    return (
      <div>
        <h2>
          Complete login process as <strong>{identifier}</strong>
        </h2>

        {Password && (
          <Password>
            <input placeholder="Password" />
          </Password>
        )}

        <button type="submit">Login</button>

        {Google && (
          <Google>
            <button>Sign in with Google</button>
          </Google>
        )}

        {Apple && (
          <Apple>
            <button>Sign in with Apple</button>
          </Apple>
        )}

        {Facebook && (
          <Facebook>
            <button>Sign in with Facebook</button>
          </Facebook>
        )}

        {Passkey && (
          <Passkey>
            <button>Sign in with Passkey</button>
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

  const { Identifier } = props

  return (
    <div>
      {Identifier && (
        <Identifier>
          <input placeholder="Identifier" />
        </Identifier>
      )}

      {Password && (
        <Password>
          <input placeholder="Password" />
        </Password>
      )}

      <button type="submit">Login</button>

      {Google && (
        <Google>
          <button>Sign in with Google</button>
        </Google>
      )}

      {Apple && (
        <Apple>
          <button>Sign in with Apple</button>
        </Apple>
      )}

      {Facebook && (
        <Facebook>
          <button>Sign in with Facebook</button>
        </Facebook>
      )}

      {Passkey && (
        <Passkey>
          <button>Sign in with Passkey</button>
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

#### TraitsForm in registration flow

```tsx
import { registrationFlow } from "@leancodepl/kratos"
import { RegistrationFlow, getErrorMessage } from "./kratosService"
import type { AuthTraitsConfig } from "./kratosService"

function RegisterPage() {
  return (
    <RegistrationFlow
      traitsForm={TraitsForm}
      onError={handleError}
      // other props
    />
  )
}

function TraitsForm({
  errors,
  Email,
  RegulationsAccepted,
  GivenName,
  Google,
  Apple,
  Facebook,
  isSubmitting,
  isValidating,
}: registrationFlow.TraitsFormProps<AuthTraitsConfig>) {
  return (
    <div>
      {Email && (
        <Email>
          <input placeholder="Email" />
        </Email>
      )}
      {GivenName && (
        <GivenName>
          <input placeholder="First name" />
        </GivenName>
      )}
      {RegulationsAccepted && (
        <RegulationsAccepted>
          <input placeholder="Regulations accepted" type="checkbox">
            I accept the regulations
          </input>
        </RegulationsAccepted>
      )}

      <button type="submit">Register</button>

      {Google && (
        <Google>
          <button>Sign up with Google</button>
        </Google>
      )}

      {Apple && (
        <Apple>
          <button>Sign up with Apple</button>
        </Apple>
      )}

      {Facebook && (
        <Facebook>
          <button>Sign up with Facebook</button>
        </Facebook>
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

const handleError: registrationFlow.OnRegistrationFlowError<AuthTraitsConfig> = ({ target, errors }) => {
  if (target === "root") {
    console.error("Form errors:", errors.map(getErrorMessage))
  } else {
    console.error(`Field ${target} errors:`, errors.map(getErrorMessage))
  }
}
```
