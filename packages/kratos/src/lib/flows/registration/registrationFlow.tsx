import { ComponentType, useEffect } from "react"
import { useKratosContext } from "../login"
import { useCreateRegistrationFlow } from "./hooks/useCreateRegistrationFlow"
import { RegisterFormProps, RegisterFormWrapper } from "./registerForm/RegisterFormWrapper"
import { OnRegistrationFlowError, TraitsConfig } from "./types"

type RegistrationFlowProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    registerForm: ComponentType<RegisterFormProps<TTraitsConfig>>
    initialFlowId?: string
    returnTo?: string
    onError?: OnRegistrationFlowError
}

export function KratosRegistrationFlow<TTraitsConfig extends TraitsConfig>({
    traitsConfig,
    registerForm: RegisterForm,
    initialFlowId,
    returnTo,
    onError,
}: RegistrationFlowProps<TTraitsConfig>) {
    const { registrationFlowId, setRegistrationFlowId } = useKratosContext()

    const { mutate: createRegistrationFlow } = useCreateRegistrationFlow({ returnTo })

    useEffect(() => {
        if (registrationFlowId) return

        if (initialFlowId) {
            setRegistrationFlowId(initialFlowId)
        } else {
            createRegistrationFlow()
        }
    }, [createRegistrationFlow, registrationFlowId, initialFlowId, setRegistrationFlowId])

    return <RegisterFormWrapper registerForm={RegisterForm} traitsConfig={traitsConfig} onError={onError} />
}

export function mkKratos<TTraitsConfig extends TraitsConfig>(traitsConfig: TTraitsConfig) {
    return {
        RegistrationFlow: (props: Omit<RegistrationFlowProps<TTraitsConfig>, "traitsConfig">) => (
            <KratosRegistrationFlow traitsConfig={traitsConfig} {...props} />
        ),
    }
}
