import { ComponentType, createContext, useContext, useEffect, useState } from "react"
import { useCreateRegistrationFlow } from "./hooks/useCreateRegistrationFlow"
import { RegisterFormProps, RegisterFormWrapper } from "./registerForm/RegisterFormWrapper"
import { OnRegistrationFlowError, TraitsConfig } from "./types"

export type RegistrationFlowProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    registerForm: ComponentType<RegisterFormProps<TTraitsConfig>>
    initialFlowId?: string
    returnTo?: string
    onError?: OnRegistrationFlowError
}

function RegistrationFlowWrapper<TTraitsConfig extends TraitsConfig>({
    traitsConfig,
    registerForm: RegisterForm,
    initialFlowId,
    returnTo,
    onError,
}: RegistrationFlowProps<TTraitsConfig>) {
    const { registrationFlowId, setRegistrationFlowId } = useRegistrationFlowContext()
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

type RegistrationFlowContext = {
    registrationFlowId?: string
    setRegistrationFlowId: (registrationFlowId: string | undefined) => void
}

const registrationFlowContext = createContext<RegistrationFlowContext | undefined>(undefined)

export function RegistrationFlow<TTraitsConfig extends TraitsConfig>(props: RegistrationFlowProps<TTraitsConfig>) {
    const [registrationFlowId, setRegistrationFlowId] = useState<string>()

    return (
        <registrationFlowContext.Provider value={{ registrationFlowId, setRegistrationFlowId }}>
            <RegistrationFlowWrapper {...props} />
        </registrationFlowContext.Provider>
    )
}

export function useRegistrationFlowContext() {
    const context = useContext(registrationFlowContext)

    if (context === undefined) {
        throw new Error("useRegistrationFlowContext must be used within a RegistrationFlow")
    }

    return context
}
