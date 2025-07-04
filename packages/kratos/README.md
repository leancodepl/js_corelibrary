# @leancodepl/kratos

React components and hooks for Ory Kratos authentication integration.

## Features

- **Complete auth flows** - Login, registration, recovery, verification, and settings flows
- **Ready-to-use components** - Login, registration, recovery, and settings cards
- **Session management** - Automatic token handling with RxJS observables
- **Customizable UI** - Override any component with your own implementation
- **Error handling** - Built-in validation and flow error management

## Installation

```bash
npm install @leancodepl/kratos
# or
yarn add @leancodepl/kratos
```

## API

### `createKratosClient(configuration)`

Creates Ory Kratos FrontendApi client with axios and credentials configuration.

**Parameters:**
- `configuration: ConfigurationParameters` - Kratos client configuration parameters

**Returns:** Configured FrontendApi instance for Kratos operations

### `useKratosContext()`

Access Kratos context data with components and error handling.

**Returns:** Kratos context data with initialized components

**Throws:** Error when Kratos context components are not initialized

### `KratosContextProvider(components, useHandleFlowError, excludeScripts, children)`

Provides Kratos context to child components with customizable configuration.

**Parameters:**
- `components?: Partial<KratosComponents>` - Partial override of default Kratos UI components
- `useHandleFlowError?: UseHandleFlowError` - Custom error handler for authentication flows
- `excludeScripts?: boolean` - Whether to exclude script node execution
- `children?: ReactNode` - Child React components

**Returns:** JSX element providing Kratos context

### `BaseSessionManager(authUrl, loginRoute)`

Manages Kratos session state with RxJS observables for authentication status.

**Parameters:**
- `authUrl: string` - Base URL for Kratos authentication endpoints
- `loginRoute: string` - Application route for login page

### `useLoginFlow(kratosClient, returnTo, onLoggedIn, onSessionAlreadyAvailable, searchParams, updateSearchParams)`

Manages Kratos login flow state and form submission.

**Parameters:**
- `kratosClient: FrontendApi` - Configured Kratos FrontendApi client
- `returnTo?: string` - URL to redirect after successful login
- `onLoggedIn?: Function` - Callback executed when user successfully logs in
- `onSessionAlreadyAvailable?: Function` - Callback when session already exists
- `searchParams?: LoginSearchParams` - URL search parameters for flow state
- `updateSearchParams: Function` - Function to update URL search parameters

**Returns:** Object with current flow and submit function

### `useRegistrationFlow(kratosClient, onSessionAlreadyAvailable, onContinueWith, searchParams, updateSearchParams)`

Manages Kratos registration flow state and form submission.

**Parameters:**
- `kratosClient: FrontendApi` - Configured Kratos FrontendApi client
- `onSessionAlreadyAvailable: Function` - Callback when session already exists
- `onContinueWith?: Function` - Optional callback for post-registration actions
- `searchParams?: Object` - URL search parameters for flow state
- `updateSearchParams: Function` - Function to update URL search parameters

**Returns:** Object with current flow, submit function, and registration status

### `useRecoveryFlow(kratosClient, onSessionAlreadyAvailable, onContinueWith, searchParams, updateSearchParams)`

Manages Kratos account recovery flow state and form submission.

**Parameters:**
- `kratosClient: FrontendApi` - Configured Kratos FrontendApi client
- `onSessionAlreadyAvailable: Function` - Callback when session already exists
- `onContinueWith?: Function` - Optional callback for post-recovery actions
- `searchParams?: Object` - URL search parameters for flow state
- `updateSearchParams: Function` - Function to update URL search parameters

**Returns:** Object with current flow, submit function, and recovery status

### `LoginCard(flow, onSubmit, className)`

Pre-built login card component for Kratos login flows.

**Parameters:**
- `flow: LoginFlow` - Kratos login flow object
- `onSubmit?: Function` - Form submission handler
- `className?: string` - Optional CSS class name

**Returns:** JSX element with login form

### `RegistrationCard(flow, onSubmit, className)`

Pre-built registration card component for Kratos registration flows.

**Parameters:**
- `flow: RegistrationFlow` - Kratos registration flow object
- `onSubmit?: Function` - Form submission handler
- `className?: string` - Optional CSS class name

**Returns:** JSX element with registration form

### `RecoveryCard(flow, onSubmit, className)`

Pre-built recovery card component for Kratos account recovery flows.

**Parameters:**
- `flow: RecoveryFlow` - Kratos recovery flow object
- `onSubmit?: Function` - Form submission handler
- `className?: string` - Optional CSS class name

**Returns:** JSX element with recovery form

### `VerificationCard(flow, onSubmit, className)`

Pre-built verification card component for Kratos verification flows.

**Parameters:**
- `flow: VerificationFlow` - Kratos verification flow object
- `onSubmit?: Function` - Form submission handler
- `className?: string` - Optional CSS class name

**Returns:** JSX element with verification form

### `useVerificationFlow(initialFlowId, kratosClient, onVerified, searchParams, updateSearchParams)`

Manages Kratos email/phone verification flow state and form submission.

**Parameters:**
- `initialFlowId?: string` - Optional initial flow ID to start with
- `kratosClient: FrontendApi` - Configured Kratos FrontendApi client
- `onVerified: Function` - Callback executed when verification is successful
- `searchParams?: Object` - URL search parameters for flow state
- `updateSearchParams: Function` - Function to update URL search parameters

**Returns:** Object with current flow, submit function, and reset function

### `useSettingsFlow(kratosClient, params, onContinueWith, searchParams, updateSearchParams)`

Manages Kratos user settings flow state and form submission.

**Parameters:**
- `kratosClient: FrontendApi` - Configured Kratos FrontendApi client
- `params?: Object` - Optional Axios request parameters
- `onContinueWith?: Function` - Optional callback for post-settings actions
- `searchParams?: Object` - URL search parameters for flow state
- `updateSearchParams: Function` - Function to update URL search parameters

**Returns:** Object with current flow and submit function

### `useReauthenticationFlow(kratosClient, onReauthenticated)`

Manages Kratos reauthentication flow for elevated security operations.

**Parameters:**
- `kratosClient: FrontendApi` - Configured Kratos FrontendApi client
- `onReauthenticated: Function` - Callback executed with session after successful reauthentication

**Returns:** Object with current flow and submit function

### `useLogoutFlow(kratosClient, returnTo, onLoggedOut)`

Manages Kratos user logout flow with callback support.

**Parameters:**
- `kratosClient: FrontendApi` - Configured Kratos FrontendApi client
- `returnTo?: string` - Optional URL to redirect after logout
- `onLoggedOut?: Function` - Optional callback executed after successful logout

**Returns:** Object with logout function

### `UserSettingsCard(flow, flowType, onSubmit, className)`

Pre-built settings card component for Kratos settings flows.

**Parameters:**
- `flow: SettingsFlow` - Kratos settings flow object
- `flowType: UserSettingsFlowType` - Type of settings flow to render
- `onSubmit?: Function` - Form submission handler
- `className?: string` - Optional CSS class name

**Returns:** JSX element with settings form or null if flow type unavailable

## Usage Examples

### Basic Setup

```typescript
import { createKratosClient, KratosContextProvider } from '@leancodepl/kratos';

const kratosClient = createKratosClient({
  basePath: 'https://auth.example.com'
});

function App() {
  return (
    <KratosContextProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </KratosContextProvider>
  );
}
```

### Login Flow

```typescript
import { useLoginFlow, LoginCard } from '@leancodepl/kratos';
import { useSearchParams, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { flow, submit } = useLoginFlow({
    kratosClient,
    onLoggedIn: (session) => navigate('/dashboard'),
    searchParams: Object.fromEntries(searchParams),
    updateSearchParams: (params) => setSearchParams(params)
  });

  if (!flow) return <div>Loading...</div>;

  return <LoginCard flow={flow} onSubmit={submit} />;
}
```

### Session Management

```typescript
import { BaseSessionManager } from '@leancodepl/kratos';
import { useEffect, useState } from 'react';

const sessionManager = new BaseSessionManager(
  'https://auth.example.com',
  '/login'
);

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const subscription = sessionManager.isLoggedIn.subscribe(setIsLoggedIn);
    const userSub = sessionManager.userId$.subscribe(setUserId);

    return () => {
      subscription.unsubscribe();
      userSub.unsubscribe();
    };
  }, []);

  return { isLoggedIn, userId };
}
```

### Custom Components

```typescript
import { KratosContextProvider, useKratosContext } from '@leancodepl/kratos';

const customComponents = {
  InputComponent: ({ node, attributes }) => (
    <input
      className="custom-input"
      {...attributes}
      value={node.attributes.value}
    />
  ),
  ButtonComponent: ({ node, attributes }) => (
    <button className="custom-button" {...attributes}>
      {node.meta.label}
    </button>
  )
};

function App() {
  return (
    <KratosContextProvider components={customComponents}>
      <LoginForm />
    </KratosContextProvider>
  );
}
```

### Registration Flow

```typescript
import { useRegistrationFlow, RegistrationCard } from '@leancodepl/kratos';

function RegisterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { flow, submit } = useRegistrationFlow({
    kratosClient,
    onRegistrationSuccess: () => navigate('/welcome'),
    searchParams: Object.fromEntries(searchParams),
    updateSearchParams: (params) => setSearchParams(params)
  });

  if (!flow) return <div>Loading...</div>;

  return (
    <div>
      <h1>Create Account</h1>
      <RegistrationCard flow={flow} onSubmit={submit} />
    </div>
  );
}
```

### Error Handling

```typescript
import { useHandleFlowError } from '@leancodepl/kratos';

function useCustomErrorHandler() {
  return useHandleFlowError({
    onUnauthenticated: () => navigate('/login'),
    onValidationError: (error) => {
      console.error('Validation failed:', error);
      toast.error('Please check your input');
    },
    resetFlow: () => setFlow(undefined)
  });
}

function AppWithErrorHandling() {
  const customErrorHandler = useCustomErrorHandler();

  return (
    <KratosContextProvider useHandleFlowError={customErrorHandler}>
      <App />
    </KratosContextProvider>
  );
}
```
