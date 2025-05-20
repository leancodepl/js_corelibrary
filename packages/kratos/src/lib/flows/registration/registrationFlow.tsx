import { ComponentType, useEffect, useMemo } from "react"
import { verificationFlow } from ".."
import { ChooseMethodFormProps } from "../login"
import { ChooseMethodFormWrapper } from "./chooseMethodForm"
import { RegistrationFlowProvider, useCreateRegistrationFlow, useRegistrationFlowContext } from "./hooks"
import { TraitsFormProps, TraitsFormWrapper } from "./traitsForm"
import { OnRegistrationFlowError, TraitsConfig } from "./types"

export type RegistrationFlowProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    traitsForm: ComponentType<TraitsFormProps<TTraitsConfig>>
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    emailVerificationForm: ComponentType<verificationFlow.EmailVerificationFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnRegistrationFlowError & verificationFlow.OnVerificationFlowError
    onRegistrationSuccess?: () => void
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
    onRegistrationSuccess,
    onVerificationSuccess,
}: RegistrationFlowProps<TTraitsConfig>) {
    const { verificationFlowId } = verificationFlow.useVerificationFlowContext()
    const { registrationFlowId, setRegistrationFlowId, traitsFormCompleted } = useRegistrationFlowContext()

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
                    onRegistrationSuccess={onRegistrationSuccess}
                />
            )}
            {step === "credentials" && (
                <ChooseMethodFormWrapper
                    chooseMethodForm={ChooseMethodForm}
                    onError={onError}
                    onRegistrationSuccess={onRegistrationSuccess}
                />
            )}
            {step === "emailVerification" && (
                <verificationFlow.VerificationFlowWrapper
                    emailVerificationForm={EmailVerificationForm}
                    onError={onError}
                    onVerificationSuccess={onVerificationSuccess}
                />
            )}
        </>
    )
}

export function RegistrationFlow<TTraitsConfig extends TraitsConfig>(props: RegistrationFlowProps<TTraitsConfig>) {
    return (
        <verificationFlow.VerificationFlowProvider>
            <RegistrationFlowProvider>
                <RegistrationFlowWrapper {...props} />
            </RegistrationFlowProvider>
        </verificationFlow.VerificationFlowProvider>
    )
}
