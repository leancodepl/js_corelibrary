import { ComponentType } from "react"
import { useFlowManager } from "../../hooks/useFlowManager"
import { EmailVerificationFormProps, EmailVerificationFormWrapper } from "./emailVerificationForm"
import {
    useCreateVerificationFlow,
    useGetVerificationFlow,
    useVerificationFlowContext,
    VerificationFlowProvider,
} from "./hooks"
import { OnVerificationFlowError } from "./types"

export type VerificationFlowProps = {
    emailVerificationForm: ComponentType<EmailVerificationFormProps>
    initialFlowId?: string
    initialVerifiableAddress?: string
    returnTo?: string
    onError?: OnVerificationFlowError
    onVerificationSuccess?: () => void
    onFlowRestart?: () => void
}

export function VerificationFlow(props: VerificationFlowProps) {
    return (
        <VerificationFlowProvider>
            <VerificationFlowWrapper {...props} />
        </VerificationFlowProvider>
    )
}

export function VerificationFlowWrapper({
    emailVerificationForm: EmailVerificationForm,
    initialFlowId,
    initialVerifiableAddress,
    returnTo,
    onError,
    onVerificationSuccess,
    onFlowRestart,
}: VerificationFlowProps) {
    const { verificationFlowId, setVerificationFlowId, verifiableAddress, setVerifiableAddress } =
        useVerificationFlowContext()

    const { error } = useGetVerificationFlow()
    const { mutate: createVerificationFlow } = useCreateVerificationFlow({
        returnTo,
    })

    useFlowManager({
        initialFlowId,
        currentFlowId: verificationFlowId,
        error,
        onFlowRestart,
        createFlow: createVerificationFlow,
        setFlowId: setVerificationFlowId,
    })

    if (!verifiableAddress && initialVerifiableAddress) {
        setVerifiableAddress(initialVerifiableAddress)
    }

    return (
        <EmailVerificationFormWrapper
            emailVerificationForm={EmailVerificationForm}
            onError={onError}
            onVerificationSuccess={onVerificationSuccess}
        />
    )
}
