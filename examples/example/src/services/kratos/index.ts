import { mkKratos } from "@leancodepl/kratos"
import { environment } from "../../environments/environment"
import { queryClient } from "../query"
import { getErrorMessage } from "./errors"
import { SessionManager } from "./session"
import { traitsConfig } from "./traits"
import type { AuthTraitsConfig } from "./traits"

const {
    session: { sessionManager },
    providers: { KratosProviders },
    flows: { RegistrationFlow, LoginFlow, RecoveryFlow, SettingsFlow, VerificationFlow, useLogout },
} = mkKratos({
    queryClient,
    basePath: environment.authUrl,
    traits: traitsConfig,
    SessionManager,
})

export {
    // traits
    AuthTraitsConfig,
    // errors
    getErrorMessage,
    // providers
    KratosProviders,
    LoginFlow,
    RecoveryFlow,
    // flows
    RegistrationFlow,
    // session
    sessionManager,
    SettingsFlow,
    useLogout,
    VerificationFlow,
}
