import { LoginFlow, RegistrationFlow, RegistrationFlowProps } from "../flows"
import { TraitsConfig } from "../flows/registration/types"

export function mkKratos<TTraitsConfig extends TraitsConfig>(traitsConfig: TTraitsConfig = {} as TTraitsConfig) {
    return {
        RegistrationFlow: (props: Omit<RegistrationFlowProps<TTraitsConfig>, "traitsConfig">) => (
            <RegistrationFlow traitsConfig={traitsConfig} {...props} />
        ),
        LoginFlow,
    }
}
