import { ReactNode } from "react"
import { loginFlow, logoutFlow, recoveryFlow, registrationFlow, settingsFlow, verificationFlow } from "../flows"
import { KratosClientProvider, KratosSessionProvider } from "../hooks"
import { Configuration, FrontendApi } from "../kratos"
import { BaseSessionManager } from "../sessionManager"
import { TraitsConfig } from "../utils"

type MkKratosConfig<TTraitsConfig extends TraitsConfig, TSessionManager extends BaseSessionManager<TTraitsConfig>> = {
    basePath: string
    traits?: TTraitsConfig
    makeSessionManager: (api: FrontendApi, basePath: string, loginPath: string) => TSessionManager
}

export function mkKratos<
    TTraitsConfig extends TraitsConfig,
    TSessionManager extends BaseSessionManager<TTraitsConfig>,
>({ basePath, traits = {} as TTraitsConfig, makeSessionManager }: MkKratosConfig<TTraitsConfig, TSessionManager>) {
    const api = new FrontendApi(
        new Configuration({
            basePath,
            credentials: "include",
        }),
    )

    const sessionManager = makeSessionManager(api, basePath, "/login")

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
        // useKratosSession: useKratosSessionContext<TTraitsConfig>,
    }

    return {
        flows,
        providers,
        session,
    }
}
