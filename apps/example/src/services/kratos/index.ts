import type { AuthTraitsConfig } from "./traits"

import { mkKratos } from "@leancodepl/kratos"
import { SessionManager } from "./session"
import { traitsConfig } from "./traits"
import { getErrorMessage } from "./errors"
import { queryClient } from "../query"
import { environment } from "../../environments/environment"

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
}
