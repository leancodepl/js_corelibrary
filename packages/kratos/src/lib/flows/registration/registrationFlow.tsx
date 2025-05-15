import { ComponentType, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { ChooseMethodFormProps } from "../login"
import { ChooseMethodFormWrapper } from "./chooseMethodForm"
import { EmailVerificationFormProps, EmailVerificationFormWrapper } from "./emailVerificationForm"
import { useCreateRegistrationFlow } from "./hooks/useCreateRegistrationFlow"
import { TraitsFormProps, TraitsFormWrapper } from "./traitsForm"
import { OnRegistrationFlowError, TraitsConfig } from "./types"

export type RegistrationFlowProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    traitsForm: ComponentType<TraitsFormProps<TTraitsConfig>>
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    emailVerificationForm: ComponentType<EmailVerificationFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnRegistrationFlowError
    onRegisterationSuccess?: () => void
    onVerificationSuccess?: () => void
}

function RegistrationFlowWrapper<TTraitsConfig extends TraitsConfig>({
    traitsConfig,
    traitsForm: TraitsForm,
    chooseMethodForm: ChooseMethodForm,
    emailVerificationForm: EmailVerificationForm,
    initialFlowId,
    returnTo,
    onError,
    onRegisterationSuccess,
    onVerificationSuccess,
}: RegistrationFlowProps<TTraitsConfig>) {
    const { registrationFlowId, setRegistrationFlowId, verificationFlowId, traitsFormCompleted } =
        useRegistrationFlowContext()
    const { mutate: createRegistrationFlow } = useCreateRegistrationFlow({ returnTo })

    useEffect(() => {
        if (registrationFlowId) return

        if (initialFlowId) {
            setRegistrationFlowId(initialFlowId)
        } else {
            createRegistrationFlow()
        }
    }, [createRegistrationFlow, registrationFlowId, initialFlowId, setRegistrationFlowId])

    const step = useMemo(() => {
        if (verificationFlowId) {
            return "emailVerification"
        }
        if (traitsFormCompleted) {
            return "credentials"
        }
        return "traits"
    }, [traitsFormCompleted, verificationFlowId])

    return (
        <>
            {step === "traits" && (
                <TraitsFormWrapper
                    traitsConfig={traitsConfig}
                    traitsForm={TraitsForm}
                    onError={onError}
                    onRegisterationSuccess={onRegisterationSuccess}
                />
            )}
            {step === "credentials" && (
                <ChooseMethodFormWrapper
                    chooseMethodForm={ChooseMethodForm}
                    onError={onError}
                    onRegisterationSuccess={onRegisterationSuccess}
                />
            )}
            {step === "emailVerification" && (
                <EmailVerificationFormWrapper
                    emailVerificationForm={EmailVerificationForm}
                    onError={onError}
                    onVerificationSuccess={onVerificationSuccess}
                />
            )}
        </>
    )
}

type RegistrationFlowContext = {
    registrationFlowId?: string
    setRegistrationFlowId: (registrationFlowId: string | undefined) => void
    verificationFlowId?: string
    setVerificationFlowId: (verificationFlowId: string | undefined) => void
    verifableAddress?: string
    setVerifiableAddress: (verifableAddress: string | undefined) => void
    traitsFormCompleted: boolean
    setTraitsFormCompleted: (traitsFormCompleted: boolean) => void
    traits: Record<string, boolean | string> | undefined
    setTraits: (traits: Record<string, boolean | string> | undefined) => void
    resetContext: () => void
}

const registrationFlowContext = createContext<RegistrationFlowContext | undefined>(undefined)

export function RegistrationFlow<TTraitsConfig extends TraitsConfig>(props: RegistrationFlowProps<TTraitsConfig>) {
    const [registrationFlowId, setRegistrationFlowId] = useState<string>()
    const [verificationFlowId, setVerificationFlowId] = useState<string>()
    const [verifableAddress, setVerifiableAddress] = useState<string>()
    const [traitsFormCompleted, setTraitsFormCompleted] = useState(false)
    const [traits, setTraits] = useState<Record<string, boolean | string> | undefined>(undefined)

    const resetContext = useCallback(() => {
        setRegistrationFlowId(undefined)
        setVerificationFlowId(undefined)
        setVerifiableAddress(undefined)
        setTraitsFormCompleted(false)
        setTraits(undefined)
    }, [])

    return (
        <registrationFlowContext.Provider
            value={{
                registrationFlowId,
                setRegistrationFlowId,
                verificationFlowId,
                setVerificationFlowId,
                verifableAddress,
                setVerifiableAddress,
                traitsFormCompleted,
                setTraitsFormCompleted,
                traits,
                setTraits,
                resetContext,
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
