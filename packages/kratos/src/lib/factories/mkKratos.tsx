import { loginFlow, logoutFlow, registrationFlow, verificationFlow } from "../flows"
import { TraitsConfig } from "../flows/registration/types"

export function mkKratos<TTraitsConfig extends TraitsConfig>(traitsConfig: TTraitsConfig = {} as TTraitsConfig) {
    return {
        LoginFlow: loginFlow.LoginFlow,
        LogoutButton: logoutFlow.LogoutButton,
        RegistrationFlow: (props: Omit<registrationFlow.RegistrationFlowProps<TTraitsConfig>, "traitsConfig">) => (
            <registrationFlow.RegistrationFlow traitsConfig={traitsConfig} {...props} />
        ),
        VerificationFlow: verificationFlow.VerificationFlow,
    }
}
