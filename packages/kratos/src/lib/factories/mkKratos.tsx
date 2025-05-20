import { loginFlow, registrationFlow, verificationFlow } from "../flows"
import { TraitsConfig } from "../flows/registration/types"

export function mkKratos<TTraitsConfig extends TraitsConfig>(traitsConfig: TTraitsConfig = {} as TTraitsConfig) {
    return {
        RegistrationFlow: (props: Omit<registrationFlow.RegistrationFlowProps<TTraitsConfig>, "traitsConfig">) => (
            <registrationFlow.RegistrationFlow traitsConfig={traitsConfig} {...props} />
        ),
        LoginFlow: loginFlow.LoginFlow,
        VerificationFlow: verificationFlow.VerificationFlow,
    }
}
