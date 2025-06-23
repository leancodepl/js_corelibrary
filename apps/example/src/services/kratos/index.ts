import type { AuthTraitsConfig } from "./traits"

import { mkKratos } from "@leancodepl/kratos"
import { SessionManager } from "./session"
import { traitsConfig } from "./traits"
import { getErrorMessage } from "./errors"
import { queryClient } from "../query"

const {
    session: { sessionManager },
    providers: { KratosProviders },
    flows: { RegistrationFlow, LoginFlow, RecoveryFlow, SettingsFlow, VerificationFlow, useLogout },
} = mkKratos({
    queryClient,
    basePath: "https://auth.local.lncd.pl",
    traits: traitsConfig,
    SessionManager,
})

const getSession = async () => {
    const result = await sessionManager.getSession()
    console.log("getSession result:", result)
}

getSession()

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
