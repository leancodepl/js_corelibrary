import { mkKratos } from "@leancodepl/kratos"
import { SessionManager } from "./session"
import { traitsConfig } from "./traits"
import { getErrorMessage } from "./errors"
import { useIsLoggedIn, useProfileInfo, useUserId } from "./hooks"

const {
    session: { sessionManager },
    providers: { KratosProviders },
    flows: { RegistrationFlow, LoginFlow, RecoveryFlow, SettingsFlow, VerificationFlow, useLogout },
} = mkKratos({
    basePath: "https://auth.local.lncd.pl",
    traits: traitsConfig,
    makeSessionManager: (api, basePath, loginPath) => new SessionManager(api, basePath, loginPath),
})

export {
    // session
    sessionManager,
    // providers
    KratosProviders,
    // flows
    RegistrationFlow,
    LoginFlow,
    RecoveryFlow,
    SettingsFlow,
    VerificationFlow,
    useLogout,
    // errors
    getErrorMessage,
    // hooks
    useIsLoggedIn,
    useProfileInfo,
    useUserId,
}
