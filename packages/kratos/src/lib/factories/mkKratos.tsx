import { loginFlow, logoutFlow, recoveryFlow, registrationFlow, settingsFlow, verificationFlow } from "../flows"
import { TraitsConfig } from "../utils"

export function mkKratos<TTraitsConfig extends TraitsConfig>(traitsConfig: TTraitsConfig = {} as TTraitsConfig) {
    return {
        useLogout: logoutFlow.useLogout,
        LoginFlow: loginFlow.LoginFlow,
        RecoveryFlow: recoveryFlow.RecoveryFlow,
        RegistrationFlow: (props: Omit<registrationFlow.RegistrationFlowProps<TTraitsConfig>, "traitsConfig">) => (
            <registrationFlow.RegistrationFlow traitsConfig={traitsConfig} {...props} />
        ),
        SettingsFlow: (props: Omit<settingsFlow.SettingsFlowProps<TTraitsConfig>, "traitsConfig">) => (
            <settingsFlow.SettingsFlow traitsConfig={traitsConfig} {...props} />
        ),
        VerificationFlow: verificationFlow.VerificationFlow,
    }
}
