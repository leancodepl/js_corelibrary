import { ReactNode } from "react"
import { QueryClient } from "@tanstack/react-query"
import { loginFlow, logoutFlow, recoveryFlow, registrationFlow, settingsFlow, verificationFlow } from "../flows"
import { KratosClientProvider, KratosSessionProvider } from "../hooks"
import { Configuration, FrontendApi } from "../kratos"
import { BaseSessionManager } from "../sessionManager"
import { BaseSessionManagerContructorProps } from "../sessionManager/baseSessionManager"
import { TraitsConfig } from "../utils"

type MkKratosConfig<TTraitsConfig extends TraitsConfig, TSessionManager extends BaseSessionManager<TTraitsConfig>> = {
    queryClient: QueryClient
    basePath: string
    traits?: TTraitsConfig
    SessionManager?: new (props: BaseSessionManagerContructorProps) => TSessionManager
}

/**
 * Creates a Kratos client factory with authentication flows, session management, and React providers.
 *
 * @template TTraitsConfig - Configuration type for user traits schema
 * @template TSessionManager - Session manager implementation extending BaseSessionManager
 * @param queryClient - React Query client instance for managing server state
 * @param basePath - Base URL for the Kratos API server
 * @param traits - Optional traits configuration object for user schema validation
 * @param SessionManager - Optional session manager constructor, defaults to BaseSessionManager
 * @returns Object containing authentication flows, React providers, and session manager
 * @example
 * ```typescript
 * import { QueryClient } from "@tanstack/react-query";
 * import { mkKratos } from "@leancodepl/kratos";
 *
 * const queryClient = new QueryClient();
 * const kratos = mkKratos({
 *   queryClient,
 *   basePath: "https://api.example.com/.ory",
 *   traits: { Email: { trait: "email", type: "string", }, GivenName: { trait: "given_name", type: "string", } } as const
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
>({
    queryClient,
    basePath,
    traits = {} as TTraitsConfig,
    SessionManager = BaseSessionManager as new (props: BaseSessionManagerContructorProps) => TSessionManager,
}: MkKratosConfig<TTraitsConfig, TSessionManager>) {
    const api = new FrontendApi(
        new Configuration({
            basePath,
            credentials: "include",
        }),
    )

    const sessionManager = new SessionManager({ queryClient, api })

    const flows = {
        useLogout: logoutFlow.useLogout,
        LoginFlow: loginFlow.LoginFlow,
        RecoveryFlow: recoveryFlow.RecoveryFlow,
        RegistrationFlow: (props: Omit<registrationFlow.RegistrationFlowProps<TTraitsConfig>, "traitsConfig">) => (
            <registrationFlow.RegistrationFlow traitsConfig={traits} {...props} />
        ),
        SettingsFlow: (props: Omit<settingsFlow.SettingsFlowProps<TTraitsConfig>, "traitsConfig">) => (
            <settingsFlow.SettingsFlow traitsConfig={traits} {...props} />
        ),
        VerificationFlow: verificationFlow.VerificationFlow,
    }

    const providers = {
        KratosProviders: ({ children }: { children: ReactNode }) => (
            <KratosClientProvider api={api}>
                <KratosSessionProvider sessionManager={sessionManager}>{children}</KratosSessionProvider>
            </KratosClientProvider>
        ),
    }

    const session = {
        sessionManager,
    }

    return {
        flows,
        providers,
        session,
    }
}
