import { ComponentType, createContext, useContext, useEffect, useState } from "react"
import { EmailVerificationFormProps, EmailVerificationFormWrapper } from "./emailVerificationForm"
import { useCreateRegistrationFlow } from "./hooks/useCreateRegistrationFlow"
import { RegisterFormProps, RegisterFormWrapper } from "./registerForm"
import { OnRegistrationFlowError, TraitsConfig } from "./types"

export type RegistrationFlowProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    registerForm: ComponentType<RegisterFormProps<TTraitsConfig>>
    emailVerificationForm: ComponentType<EmailVerificationFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnRegistrationFlowError
    onRegisterationSuccess?: () => void
    onVerificationSuccess?: () => void
}

function RegistrationFlowWrapper<TTraitsConfig extends TraitsConfig>({
    traitsConfig,
    registerForm: RegisterForm,
    emailVerificationForm: EmailVerificationForm,
    initialFlowId,
    returnTo,
    onError,
    onRegisterationSuccess,
    onVerificationSuccess,
}: RegistrationFlowProps<TTraitsConfig>) {
    const { registrationFlowId, setRegistrationFlowId, verificationFlowId } = useRegistrationFlowContext()
    const { mutate: createRegistrationFlow } = useCreateRegistrationFlow({ returnTo })

    useEffect(() => {
        if (registrationFlowId) return

        if (initialFlowId) {
            setRegistrationFlowId(initialFlowId)
        } else {
            createRegistrationFlow()
        }
    }, [createRegistrationFlow, registrationFlowId, initialFlowId, setRegistrationFlowId])

    if (verificationFlowId) {
        return (
            <EmailVerificationFormWrapper
                emailVerificationForm={EmailVerificationForm}
                onError={onError}
                onVerificationSuccess={onVerificationSuccess}
            />
        )
    }

    return (
        <RegisterFormWrapper
            registerForm={RegisterForm}
            traitsConfig={traitsConfig}
            onError={onError}
            onRegisterationSuccess={onRegisterationSuccess}
        />
    )
}

type RegistrationFlowContext = {
    registrationFlowId?: string
    setRegistrationFlowId: (registrationFlowId: string | undefined) => void
    verificationFlowId?: string
    setVerificationFlowId: (verificationFlowId: string | undefined) => void
    verifableAddress?: string
    setVerifiableAddress: (verifableAddress: string | undefined) => void
}

const registrationFlowContext = createContext<RegistrationFlowContext | undefined>(undefined)

export function RegistrationFlow<TTraitsConfig extends TraitsConfig>(props: RegistrationFlowProps<TTraitsConfig>) {
    const [registrationFlowId, setRegistrationFlowId] = useState<string>()
    const [verificationFlowId, setVerificationFlowId] = useState<string>()
    const [verifableAddress, setVerifiableAddress] = useState<string>()

    return (
        <registrationFlowContext.Provider
            value={{
                registrationFlowId,
                setRegistrationFlowId,
                verificationFlowId,
                setVerificationFlowId,
                verifableAddress,
                setVerifiableAddress,
            }}>
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
