import { ReactNode } from "react"
import { loginFlow, logoutFlow, recoveryFlow, registrationFlow, settingsFlow, verificationFlow } from "../flows"
import { KratosClientProvider, KratosSessionProvider } from "../hooks"
import { Configuration, FrontendApi } from "../kratos"
import { BaseSessionManager } from "../sessionManager"
import { TraitsConfig } from "../utils"

type MkKratosConfig<TTraitsConfig extends TraitsConfig, TSessionManager extends BaseSessionManager<TTraitsConfig>> = {
    basePath: string
    loginPath: string
    traits?: TTraitsConfig
    SessionManager?: new (api: FrontendApi, basePath: string, loginPath: string) => TSessionManager
}

export function mkKratos<
    TTraitsConfig extends TraitsConfig,
    TSessionManager extends BaseSessionManager<TTraitsConfig>,
>({
    basePath,
    loginPath,
    traits = {} as TTraitsConfig,
    SessionManager = BaseSessionManager as new (
        api: FrontendApi,
        basePath: string,
        loginPath: string,
    ) => TSessionManager,
}: MkKratosConfig<TTraitsConfig, TSessionManager>) {
    const api = new FrontendApi(
        new Configuration({
            basePath,
            credentials: "include",
        }),
    )

    const sessionManager = new SessionManager(api, basePath, loginPath)

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
