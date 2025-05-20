import { ComponentType, useEffect, useMemo } from "react"
import { verificationFlow } from ".."
import { ChooseMethodFormProps, ChooseMethodFormWrapper } from "./chooseMethodForm"
import { LoginFlowProvider, useCreateLoginFlow, useGetLoginFlow, useLoginFlowContext } from "./hooks"
import { SecondFactorEmailFormProps, SecondFactorEmailFormWrapper } from "./secondFactorEmailForm"
import { SecondFactorFormProps, SecondFactorFormWrapper } from "./secondFactorForm"
import { OnLoginFlowError } from "./types"

export type LoginFlowProps = {
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    secondFactorForm: ComponentType<SecondFactorFormProps>
    secondFactorEmailForm: ComponentType<SecondFactorEmailFormProps>
    emailVerificationForm: ComponentType<verificationFlow.EmailVerificationFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnLoginFlowError & verificationFlow.OnVerificationFlowError
    onVerificationSuccess?: () => void
}

function LoginFlowWrapper({
    chooseMethodForm: ChooseMethodForm,
    secondFactorForm: SecondFactorForm,
    secondFactorEmailForm: SecondFactorEmailForm,
    emailVerificationForm: EmailVerificationForm,
    initialFlowId,
    returnTo,
    onError,
    onVerificationSuccess,
}: LoginFlowProps) {
    const { loginFlowId, setLoginFlowId } = useLoginFlowContext()
    const { verificationFlowId } = verificationFlow.useVerificationFlowContext()

    const { mutate: createLoginFlow } = useCreateLoginFlow({ returnTo })
    const { data: loginFlow } = useGetLoginFlow()

    useEffect(() => {
        if (loginFlowId) return

        if (initialFlowId) {
            setLoginFlowId(initialFlowId)
        } else {
            createLoginFlow()
        }
    }, [loginFlowId, initialFlowId, createLoginFlow, setLoginFlowId])

    const step = useMemo(() => {
        if (!loginFlow) return "chooseMethod"

        if (verificationFlowId) return "verifyEmail"

        if (loginFlow.state === "choose_method") {
            if (loginFlow.requested_aal === "aal1") return "chooseMethod"
            if (loginFlow.requested_aal === "aal2") return "secondFactor"
        }

        if (loginFlow.state === "sent_email") return "secondFactorEmail"

        throw new Error("Invalid login flow state")
    }, [loginFlow, verificationFlowId])

    return (
        <>
            {step === "chooseMethod" && (
                <ChooseMethodFormWrapper chooseMethodForm={ChooseMethodForm} onError={onError} />
            )}
            {step === "secondFactor" && (
                <SecondFactorFormWrapper secondFactorForm={SecondFactorForm} onError={onError} />
            )}
            {step === "secondFactorEmail" && (
                <SecondFactorEmailFormWrapper secondFactorForm={SecondFactorEmailForm} onError={onError} />
            )}
            {step === "verifyEmail" && (
                <verificationFlow.VerificationFlowWrapper
                    emailVerificationForm={EmailVerificationForm}
                    onError={onError}
                    onVerificationSuccess={onVerificationSuccess}
                />
            )}
        </>
    )
}

export function LoginFlow(props: LoginFlowProps) {
    return (
        <verificationFlow.VerificationFlowProvider>
            <LoginFlowProvider>
                <LoginFlowWrapper {...props} />
            </LoginFlowProvider>
        </verificationFlow.VerificationFlowProvider>
    )
}
