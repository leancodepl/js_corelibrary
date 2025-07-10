import { ComponentType, useEffect, useMemo } from "react"
import { useFlowManager } from "../../hooks"
import { isSessionAlreadyAvailable } from "../../kratos"
import { TraitsConfig } from "../../utils"
import {
    EmailVerificationFormProps,
    useVerificationFlowContext,
    VerificationFlowProvider,
    VerificationFlowWrapper,
} from "../verification"
import { ChooseMethodFormProps, ChooseMethodFormWrapper } from "./chooseMethodForm"
import {
    RegistrationFlowProvider,
    useCreateRegistrationFlow,
    useGetRegistrationFlow,
    useRegistrationFlowContext,
} from "./hooks"
import { TraitsFormProps, TraitsFormWrapper } from "./traitsForm"
import { OnRegistrationFlowError } from "./types"

export type RegistrationFlowProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    traitsForm: ComponentType<TraitsFormProps<TTraitsConfig>>
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    emailVerificationForm: ComponentType<EmailVerificationFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnRegistrationFlowError<TTraitsConfig>
    onRegistrationSuccess?: () => void
    onVerificationSuccess?: () => void
    onFlowRestart?: () => void
    onSessionAlreadyAvailable?: () => void
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
    onFlowRestart,
    onSessionAlreadyAvailable,
}: RegistrationFlowProps<TTraitsConfig>) {
    const { verificationFlowId } = useVerificationFlowContext()
    const { registrationFlowId, setRegistrationFlowId, traitsFormCompleted } = useRegistrationFlowContext()

    const { error: getRegistrationFlowError } = useGetRegistrationFlow()
    const { mutate: createRegistrationFlow, error: createRegistrationFlowError } = useCreateRegistrationFlow({
        returnTo,
    })

    useFlowManager({
        initialFlowId,
        currentFlowId: registrationFlowId,
        error: getRegistrationFlowError ?? undefined,
        onFlowRestart,
        createFlow: createRegistrationFlow,
        setFlowId: setRegistrationFlowId,
    })

    useEffect(() => {
        if (
            isSessionAlreadyAvailable(getRegistrationFlowError) ||
            isSessionAlreadyAvailable(createRegistrationFlowError)
        ) {
            onSessionAlreadyAvailable?.()
        }
    }, [getRegistrationFlowError, createRegistrationFlowError, onSessionAlreadyAvailable])

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
                <VerificationFlowWrapper
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
        <VerificationFlowProvider>
            <RegistrationFlowProvider>
                <RegistrationFlowWrapper {...props} />
            </RegistrationFlowProvider>
        </VerificationFlowProvider>
    )
}
