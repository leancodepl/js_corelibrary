# @leancodepl/kratos

React components and hooks for Ory Kratos authentication flows with complete session management and customizable UI
components.

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

**Returns:** Object containing authentication flows, React providers, and session manager

### `BaseSessionManager(queryClient, api)`

Manages Ory Kratos session and identity state with React Query integration.

**Parameters:**

- `queryClient: QueryClient` - React Query `QueryClient` instance for caching and fetching session data
- `api: FrontendApi` - Ory Kratos `FrontendApi` instance for session and identity requests

### `LoginFlow(props)`

Renders a complete login flow with multi-step authentication support.

**Parameters:**

- `props: LoginFlowProps` - Configuration and component props for the login flow

**Returns:** JSX element containing the complete login flow interface

### `RegistrationFlow(props)`

Provides a complete registration flow with step-by-step form handling and verification.

**Parameters:**

- `props: RegistrationFlowProps<TTraitsConfig>` - Registration flow configuration and form components

**Returns:** React component that renders the appropriate registration step

### `SettingsFlow(props)`

Renders a complete settings flow with user account management capabilities.

**Parameters:**

- `props: SettingsFlowProps<TTraitsConfig>` - Settings flow configuration and form components

**Returns:** React component for the settings flow

### `RecoveryFlow(props)`

Renders a multi-step password recovery flow with email verification and password reset.

**Parameters:**

- `props: RecoveryFlowProps` - Recovery flow configuration with form components

**Returns:** JSX element with configured recovery flow providers and step management

### `VerificationFlow(props)`

Renders email verification flow with provider context and flow management.

**Parameters:**

- `props: VerificationFlowProps` - Verification flow configuration with form components

**Returns:** JSX element with verification flow provider and wrapper

### `useLogout()`

Provides logout functionality for Kratos authentication flows.

**Returns:** Object containing logout function that accepts optional returnTo parameter

### `useVerificationFlowContext()`

Accesses the verification flow context for managing email verification state.

**Returns:** Object containing verification flow state and control functions

**Throws:** `Error` - When used outside of VerificationFlowProvider context

### `useSettingsFlowContext()`

Accesses the settings flow context for managing user account settings state.

**Returns:** Object containing settings flow state and control functions

**Throws:** `Error` - When used outside of SettingsFlowProvider context

## Usage Examples

### Basic Setup

```typescript
import { QueryClient } from "@tanstack/react-query";
import { mkKratos } from "@leancodepl/kratos";

const queryClient = new QueryClient();
const traitsConfig = {
  Email: { trait: "email", type: "string" },
  GivenName: { trait: "given_name", type: "string" },
  RegulationsAccepted: { trait: "regulations_accepted", type: "boolean" }
} as const;

const { session, providers, flows } = mkKratos({
  queryClient,
  basePath: "https://auth.example.com/.ory",
  traits: traitsConfig
});

function App() {
  return (
    <providers.KratosProviders>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </providers.KratosProviders>
  );
}
```

### Login Flow

```typescript
import { flows } from "../services/kratos";
import { useNavigate } from "@tanstack/react-router";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <flows.LoginFlow
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
import { flows } from "../services/kratos";
import type { AuthTraitsConfig } from "../services/kratos";

function RegisterPage() {
  return (
    <flows.RegistrationFlow
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

### Settings Flow

```typescript
import { flows } from "../services/kratos";

function SettingsPage() {
  const { isLoggedIn, isLoading } = sessionManager.useIsLoggedIn();

  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Access denied</div>;

  return (
    <flows.SettingsFlow
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
import { flows } from "../services/kratos";

function RecoveryPage() {
  return (
    <flows.RecoveryFlow
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
import { flows } from "../services/kratos";
import type { AuthTraitsConfig } from "../services/kratos";

function RegisterPage() {
  return (
    <flows.RegistrationFlow
      chooseMethodForm={ChooseMethodForm}
    />
  );
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
                {Password && (
                    <Password>
                        <input placeholder="Password" />
                    </Password>
                )}

                <button type="submit">
                    Login
                </button>

                {Google && (
                    <Google>
                        <button>
                            Sign in with Google
                        </button>
                    </Google>
                )}

                {Apple && (
                    <Apple>
                        <button>
                            Sign in with Apple
                        </button>
                    </Apple>
                )}

                {Facebook && (
                    <Facebook>
                        <button>
                            Sign in with Facebook
                        </button>
                    </Facebook>
                )}

                {Passkey && (
                    <Passkey>
                        <button>
                            Sign in with Passkey
                        </button>
                    </Passkey>
                )}

                {errors && errors.length > 0 && (
                    <div data-testid={dataTestIds.common.errors}>
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

            <button type="submit">
                Login
            </button>

            {Google && (
                <Google>
                    <button>
                        Sign in with Google
                    </button>
                </Google>
            )}

            {Apple && (
                <Apple>
                    <button>
                        Sign in with Apple
                    </button>
                </Apple>
            )}

            {Facebook && (
                <Facebook>
                    <button>
                        Sign in with Facebook
                    </button>
                </Facebook>
            )}

            {Passkey && (
                <Passkey>
                    <button>
                        Sign in with Passkey
                    </button>
                </Passkey>
            )}

            {errors && errors.length > 0 && (
                <div data-testid={dataTestIds.common.errors}>
                    {errors.map(error => (
                        <div key={error.id}>{getErrorMessage(error)}</div>
                    ))}
                </div>
            )}
        </div>
    )
}
```
