import { ComponentType, useEffect } from "react"
import { EmailVerificationFormProps, EmailVerificationFormWrapper } from "./emailVerificationForm"
import { useCreateVerificationFlow, useVerificationFlowContext, VerificationFlowProvider } from "./hooks"
import { OnVerificationFlowError } from "./types"

export type VerificationFlowProps = {
    emailVerificationForm: ComponentType<EmailVerificationFormProps>
    initialFlowId?: string
    initialVerifiableAddress?: string
    returnTo?: string
    onError?: OnVerificationFlowError
    onVerificationSuccess?: () => void
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
}: VerificationFlowProps) {
    const { verificationFlowId, setVerificationFlowId, verifiableAddress, setVerifiableAddress } =
        useVerificationFlowContext()

    const { mutate: createVerificationFlow } = useCreateVerificationFlow({ returnTo })

    useEffect(() => {
        if (verificationFlowId) return

        if (initialFlowId) {
            setVerificationFlowId(initialFlowId)
        } else {
            createVerificationFlow()
        }
    }, [createVerificationFlow, initialFlowId, verificationFlowId, setVerificationFlowId])

    useEffect(() => {
        if (verifiableAddress) return

        if (initialVerifiableAddress) {
            setVerifiableAddress(initialVerifiableAddress)
        }
    }, [initialVerifiableAddress, setVerifiableAddress, verifiableAddress])

    return (
        <EmailVerificationFormWrapper
            emailVerificationForm={EmailVerificationForm}
            onError={onError}
            onVerificationSuccess={onVerificationSuccess}
        />
    )
}
