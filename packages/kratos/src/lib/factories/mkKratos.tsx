import { ComponentType, ReactNode } from "react"
import { QueryClient } from "@tanstack/react-query"
import { loginFlow, logoutFlow, recoveryFlow, registrationFlow, settingsFlow, verificationFlow } from "../flows"
import { LoginFlowProps } from "../flows/login"
import { UseLogout } from "../flows/logout"
import { RecoveryFlowProps } from "../flows/recovery"
import { RegistrationFlowProps } from "../flows/registration"
import { SettingsFlowProps } from "../flows/settings"
import { VerificationFlowProps } from "../flows/verification"
import { KratosClientProvider, KratosSessionProvider } from "../hooks"
import { Configuration, FrontendApi } from "../kratos"
import { BaseSessionManager } from "../sessionManager"
import { BaseSessionManagerContructorProps } from "../sessionManager/baseSessionManager"
import { OidcProvidersConfig, TraitsConfig } from "../utils"

export type MkKratosConfig<
  TTraitsConfig extends TraitsConfig,
  TSessionManager extends BaseSessionManager<TTraitsConfig>,
  TOidcProvidersConfig extends OidcProvidersConfig,
> = {
  queryClient: QueryClient
  basePath: string
  traits?: TTraitsConfig
  SessionManager?: new (props: BaseSessionManagerContructorProps) => TSessionManager
  oidcProviders?: TOidcProvidersConfig
}

export type FlowsConfig<
  TTraitsConfig extends TraitsConfig,
  TOidcProvidersConfig extends OidcProvidersConfig = readonly [],
> = {
  /**
   * Provides logout functionality for Kratos authentication flows.
   *
   * Handles the complete logout process including creating logout flow,
   * updating session state, cleaning up cached queries, and optional redirects.
   *
   * @returns Object containing logout function that accepts optional returnTo parameter
   * @example
   * ```tsx
   * function LogoutButton() {
   *   const { logout } = kratos.flows.useLogout();
   *
   *   const handleLogout = async () => {
   *     const result = await logout({ returnTo: "/login" });
   *     if (!result.isSuccess) {
   *       console.error("Logout failed:", result.error);
   *     }
   *   };
   *
   *   return <button onClick={handleLogout}>Logout</button>;
   * }
   * ```
   */
  useLogout: UseLogout

  /**
   * Renders a complete login flow with multi-step authentication support.
   *
   * Handles login method selection, second-factor authentication, email verification,
   * and session management. Provides context for managing flow state and transitions
   * between different authentication steps.
   *
   * @param props - Configuration and component props for the login flow
   * @param props.chooseMethodForm - React component for login method selection
   * @param props.secondFactorForm - React component for second factor authentication
   * @param props.secondFactorEmailForm - React component for email-based second factor
   * @param props.emailVerificationForm - React component for email verification process
   * @param props.initialFlowId - Optional existing login flow ID to resume
   * @param props.returnTo - Optional URL to redirect after successful login
   * @param props.onError - Optional callback for handling login flow errors
   * @param props.onLoginSuccess - Optional callback triggered after successful login
   * @param props.onVerificationSuccess - Optional callback triggered after email verification
   * @param props.onFlowRestart - Optional callback triggered when flow restarts due to expiration
   * @param props.onSessionAlreadyAvailable - Optional callback triggered when user is already authenticated
   * @returns JSX element containing the complete login flow interface
   * @example
   * ```tsx
   * <LoginFlow
   *   chooseMethodForm={ChooseMethodForm}
   *   secondFactorForm={SecondFactorForm}
   *   secondFactorEmailForm={SecondFactorEmailForm}
   *   emailVerificationForm={EmailVerificationForm}
   *   onLoginSuccess={() => navigate('/dashboard')}
   *   onSessionAlreadyAvailable={() => navigate('/dashboard')}
   * />
   * ```
   */
  LoginFlow: ComponentType<LoginFlowProps<TOidcProvidersConfig>>

  /**
   * Renders a multi-step password recovery flow with email verification and password reset.
   *
   * Manages the complete recovery process from email submission through code verification
   * to password reset, automatically handling flow state transitions and provider setup.
   *
   * @param props.emailForm - React component for email input step
   * @param props.codeForm - React component for verification code input step
   * @param props.newPasswordForm - React component for new password input step
   * @param props.initialFlowId - Optional existing recovery flow ID to continue
   * @param props.returnTo - Optional URL to redirect after successful recovery
   * @param props.onError - Optional error handler for recovery flow failures
   * @param props.onRecoverySuccess - Optional callback fired when password recovery completes
   * @param props.onFlowRestart - Optional callback fired when flow restarts due to errors
   * @returns JSX element with configured recovery flow providers and step management
   *
   * @example
   * ```tsx
   * <RecoveryFlow
   *   emailForm={EmailForm}
   *   codeForm={CodeForm}
   *   newPasswordForm={NewPasswordForm}
   *   onRecoverySuccess={() => console.log("Recovery completed")}
   *   onError={(error) => console.error("Recovery failed:", error)}
   * />
   * ```
   */
  RecoveryFlow: ComponentType<RecoveryFlowProps>

  /**
   * Provides a complete registration flow with step-by-step form handling and verification.
   *
   * Manages the user registration process through multiple steps: traits collection,
   * credentials selection, and optional email verification. Automatically handles flow
   * transitions and error states.
   *
   * @param props - Registration flow configuration and form components
   * @param props.traitsForm - React component for collecting user traits (name, email, etc.)
   * @param props.chooseMethodForm - React component for selecting authentication method
   * @param props.emailVerificationForm - React component for email verification process
   * @param props.initialFlowId - Optional existing flow ID to resume registration
   * @param props.returnTo - Optional URL to redirect after successful registration
   * @param props.onError - Optional callback for handling registration flow errors
   * @param props.onRegistrationSuccess - Optional callback triggered after successful registration
   * @param props.onVerificationSuccess - Optional callback triggered after email verification
   * @param props.onFlowRestart - Optional callback triggered when flow restarts due to expiration
   * @param props.onSessionAlreadyAvailable - Optional callback triggered when user is already authenticated
   * @returns React component that renders the appropriate registration step
   * @example
   * ```tsx
   * <RegistrationFlow
   *   traitsForm={UserTraitsForm}
   *   chooseMethodForm={MethodSelectionForm}
   *   emailVerificationForm={EmailVerifyForm}
   *   onRegistrationSuccess={() => console.log('Registration completed')}
   *   onVerificationSuccess={() => console.log('Email verified')}
   * />
   * ```
   */
  RegistrationFlow: ComponentType<Omit<RegistrationFlowProps<TTraitsConfig, TOidcProvidersConfig>, "traitsConfig">>

  /**
   * Renders a complete settings flow with user account management capabilities.
   *
   * @param props - Settings flow configuration and form components
   * @param props.traitsForm - Component for editing user traits/profile information
   * @param props.newPasswordForm - Component for changing user password
   * @param props.passkeysForm - Component for managing passkey authentication
   * @param props.totpForm - Component for TOTP/2FA configuration
   * @param props.oidcForm - Component for OAuth/OIDC provider management
   * @param props.initialFlowId - Existing flow ID to resume
   * @param props.initialVerifiableAddress - Email address requiring verification
   * @param props.onError - Callback for handling flow errors
   * @param props.onChangePasswordSuccess - Callback after successful password change
   * @param props.onChangeTraitsSuccess - Callback after successful traits update
   * @param props.onFlowRestart - Callback when flow restarts
   * @param props.settingsForm - Main settings form component that renders all sections
   * @returns React component for the settings flow
   * @example
   * ```tsx
   * <SettingsFlow
   *   traitsForm={TraitsForm}
   *   newPasswordForm={PasswordForm}
   *   settingsForm={MainSettings}
   *   onChangePasswordSuccess={() => console.log('Password updated')}
   *   onError={(error) => console.error('Settings error:', error)}
   * />
   * ```
   */
  SettingsFlow: ComponentType<Omit<SettingsFlowProps<TTraitsConfig, TOidcProvidersConfig>, "traitsConfig">>

  /**
   * Renders email verification flow with provider context and flow management.
   *
   * @param emailVerificationForm - Component to render the verification form UI
   * @param initialFlowId - Optional flow ID to initialize with existing flow
   * @param initialVerifiableAddress - Optional email address to pre-populate
   * @param returnTo - Optional URL to redirect to after successful verification
   * @param onError - Optional callback for handling verification errors
   * @param onVerificationSuccess - Optional callback for successful verification
   * @param onFlowRestart - Optional callback when flow needs to restart
   * @returns JSX element with verification flow provider and wrapper
   * @example
   * ```tsx
   * <VerificationFlow
   *   emailVerificationForm={EmailForm}
   *   initialVerifiableAddress="user@example.com"
   *   onVerificationSuccess={() => navigate("/dashboard")}
   *   onError={(error) => console.error("Verification failed:", error)}
   * />
   * ```
   */
  VerificationFlow: ComponentType<VerificationFlowProps>
}

/**
 * Creates a Kratos client factory with authentication flows, session management, and React providers.
 *
 * @template TTraitsConfig - Configuration type for user traits schema
 * @template TSessionManager - Session manager implementation extending {@link BaseSessionManager}
 * @template TOidcProvidersConfig - Configuration type for OIDC providers array
 * @param queryClient - React Query client instance for managing server state
 * @param basePath - Base URL for the Kratos API server
 * @param traits - Optional traits configuration object for user schema validation
 * @param SessionManager - Optional session manager constructor, defaults to {@link BaseSessionManager}
 * @param oidcProviders - Optional array of custom OIDC provider configurations. Each provider should have an `id` (matching Kratos provider ID) and optional `label`. Define as `as const` for type safety.
 * @returns Object containing authentication flows, React providers, and session manager
 * @example
 * ```tsx
 * import { QueryClient } from "@tanstack/react-query";
 * import { mkKratos } from "@leancodepl/kratos";
 *
 * const queryClient = new QueryClient();
 * const oidcProviders = [{ id: "google" }, { id: "github" }] as const;
 * const kratos = mkKratos({
 *   queryClient,
 *   basePath: "https://api.example.com/.ory",
 *   traits: { Email: { trait: "email", type: "string", }, GivenName: { trait: "given_name", type: "string", } } as const,
 *   oidcProviders,
 * });
 *
 * // Use flows
 * function LoginPage() {
 *   return <kratos.flows.LoginFlow onSuccess={() => console.log("Logged in")} />;
 * }
 *
 * // Wrap app with providers
 * function App() {
 *   return (
 *     <kratos.providers.KratosProviders>
 *       <LoginPage />
 *     </kratos.providers.KratosProviders>
 *   );
 * }
 * ```
 */
export function mkKratos<
  TTraitsConfig extends TraitsConfig,
  TSessionManager extends BaseSessionManager<TTraitsConfig>,
  TOidcProvidersConfig extends OidcProvidersConfig = readonly [],
>({
  queryClient,
  basePath,
  traits = {} as TTraitsConfig,
  SessionManager = BaseSessionManager as new (props: BaseSessionManagerContructorProps) => TSessionManager,
  oidcProviders = ([] as const) as unknown as TOidcProvidersConfig,
}: MkKratosConfig<TTraitsConfig, TSessionManager, TOidcProvidersConfig>) {
  const api = new FrontendApi(
    new Configuration({
      basePath,
      credentials: "include",
    }),
  )

  const sessionManager = new SessionManager({ queryClient, api })

  const flows: FlowsConfig<TTraitsConfig, TOidcProvidersConfig> = {
    useLogout: logoutFlow.useLogout,
    LoginFlow: props => <loginFlow.LoginFlow oidcProvidersConfig={oidcProviders} {...props} />,
    RecoveryFlow: recoveryFlow.RecoveryFlow,
    RegistrationFlow: props => <registrationFlow.RegistrationFlow traitsConfig={traits} oidcProvidersConfig={oidcProviders} {...props} />,
    SettingsFlow: props => <settingsFlow.SettingsFlow traitsConfig={traits} oidcProvidersConfig={oidcProviders} {...props} />,
    VerificationFlow: verificationFlow.VerificationFlow,
  }

  const providers = {
    /**
     * Provides React context for Kratos authentication flows and session management.
     *
     * Combines `KratosClientProvider` for API access and `KratosSessionProvider` for session management
     * to enable authentication flows and session management throughout your component tree.
     * Must wrap your application or the parts that use Kratos functionality.
     *
     * @param children - React children components that will have access to Kratos context
     * @returns JSX element that provides Kratos context to child components
     * @example
     * ```tsx
     * function App() {
     *   return (
     *     <KratosProviders>
     *       <Router>
     *         <Routes>
     *           <Route path="/login" element={<LoginPage />} />
     *           <Route path="/profile" element={<ProfilePage />} />
     *         </Routes>
     *       </Router>
     *     </KratosProviders>
     *   );
     * }
     * ```
     */
    KratosProviders: ({ children }: { children: ReactNode }) => (
      <KratosClientProvider api={api}>
        <KratosSessionProvider sessionManager={sessionManager}>{children}</KratosSessionProvider>
      </KratosClientProvider>
    ),
  }

  const session = {
    /**
     * Manages Ory Kratos session and identity state with React Query integration.
     *
     * Provides both async methods and React hooks for session management, identity access,
     * and authentication state. Can be extended with custom trait-specific methods when using
     * a custom SessionManager class.
     *
     * Available methods:
     * - Session management: `getSession()`, `useSession()`, `checkIfLoggedIn()`
     * - Identity access: `getIdentity()`, `useIdentity()`, `getUserId()`, `useUserId()`
     * - Authentication state: `isLoggedIn()`, `useIsLoggedIn()`, `useIsAal2Required()`
     *
     * @example
     * ```tsx
     * // Using hooks in components
     * function UserProfile() {
     *   const { isLoggedIn, isLoading } = session.sessionManager.useIsLoggedIn();
     *   const { userId } = session.sessionManager.useUserId();
     *
     *   if (isLoading) return <div>Loading...</div>;
     *   if (!isLoggedIn) return <div>Please log in</div>;
     *
     *   return <div>Welcome, User ID: {userId}</div>;
     * }
     *
     * // Using async methods
     * const checkAuth = async () => {
     *   const isLoggedIn = await session.sessionManager.isLoggedIn();
     *   const userId = await session.sessionManager.getUserId();
     * };
     * ```
     */
    sessionManager,
  }

  return {
    flows,
    providers,
    session,
  }
}

export { type LoginFlowProps } from "../flows/login"
export { type RecoveryFlowProps } from "../flows/recovery"
export { type RegistrationFlowProps } from "../flows/registration"
export { type SettingsFlowProps } from "../flows/settings"
export { type UseLogout } from "../flows/logout"
export { type VerificationFlowProps } from "../flows/verification"
