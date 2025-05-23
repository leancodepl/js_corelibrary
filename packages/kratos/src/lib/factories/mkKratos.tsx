import { loginFlow, logoutFlow, recoveryFlow, registrationFlow, verificationFlow } from "../flows"
import { TraitsConfig } from "../flows/registration/types"

export function mkKratos<TTraitsConfig extends TraitsConfig>(traitsConfig: TTraitsConfig = {} as TTraitsConfig) {
    return {
        useLogout: logoutFlow.useLogout,
        LoginFlow: loginFlow.LoginFlow,
        RecoveryFlow: recoveryFlow.RecoveryFlow,
        RegistrationFlow: (props: Omit<registrationFlow.RegistrationFlowProps<TTraitsConfig>, "traitsConfig">) => (
            <registrationFlow.RegistrationFlow traitsConfig={traitsConfig} {...props} />
        ),
        VerificationFlow: verificationFlow.VerificationFlow,
    }
}
