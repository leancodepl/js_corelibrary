import { ComponentType, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { ChooseMethodFormProps, ChooseMethodFormWrapper } from "./chooseMethodForm"
import { EmailVerificationFormProps, EmailVerificationFormWrapper } from "./emailVerificationForm"
import { useCreateLoginFlow, useGetLoginFlow } from "./hooks"
import { useCreateVerificationFlow } from "./hooks/useCreateVerificationFlow"
import { SecondFactorEmailFormProps, SecondFactorEmailFormWrapper } from "./secondFactorEmailForm"
import { SecondFactorFormProps, SecondFactorFormWrapper } from "./secondFactorForm"
import { OnLoginFlowError } from "./types"

export type LoginFlowProps = {
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    secondFactorForm: ComponentType<SecondFactorFormProps>
    secondFactorEmailForm: ComponentType<SecondFactorEmailFormProps>
    emailVerificationForm: ComponentType<EmailVerificationFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnLoginFlowError
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
    const { loginFlowId, setLoginFlowId, verificationFlowId, verifableAddress } = useLoginFlowContext()

    const { mutate: createLoginFlow } = useCreateLoginFlow({ returnTo })
    const { mutate: createVerificationFlow } = useCreateVerificationFlow({ returnTo })
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

        if (verifableAddress) return "verifyEmail"

        if (loginFlow.state === "choose_method") {
            if (loginFlow.requested_aal === "aal1") return "chooseMethod"
            if (loginFlow.requested_aal === "aal2") return "secondFactor"
        }

        if (loginFlow.state === "sent_email") return "secondFactorEmail"

        throw new Error("Invalid login flow state")
    }, [loginFlow, verifableAddress])

    useEffect(() => {
        if (verificationFlowId || step !== "verifyEmail") return

        console.log("Creating verification flow")
        createVerificationFlow()
    }, [createLoginFlow, createVerificationFlow, loginFlow, step, verificationFlowId])

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
                <EmailVerificationFormWrapper
                    emailVerificationForm={EmailVerificationForm}
                    onError={onError}
                    onVerificationSuccess={onVerificationSuccess}
                />
            )}
        </>
    )
}

type LoginFlowContext = {
    loginFlowId?: string
    setLoginFlowId: (loginFlowId: string | undefined) => void
    verificationFlowId?: string
    setVerificationFlowId: (verificationFlowId: string | undefined) => void
    verifableAddress?: string
    setVerifiableAddress: (verifableAddress: string | undefined) => void
    resetContext: () => void
}

const loginFlowContext = createContext<LoginFlowContext | undefined>(undefined)

export function LoginFlow(props: LoginFlowProps) {
    const [loginFlowId, setLoginFlowId] = useState<string>()

    const [verificationFlowId, setVerificationFlowId] = useState<string>()
    const [verifableAddress, setVerifiableAddress] = useState<string>()

    const resetContext = useCallback(() => {
        setLoginFlowId(undefined)
        setVerificationFlowId(undefined)
        setVerifiableAddress(undefined)
    }, [])

    return (
        <loginFlowContext.Provider
            value={{
                loginFlowId,
                setLoginFlowId,
                verificationFlowId,
                setVerificationFlowId,
                verifableAddress,
                setVerifiableAddress,
                resetContext,
            }}>
            <LoginFlowWrapper {...props} />
        </loginFlowContext.Provider>
    )
}

export function useLoginFlowContext() {
    const context = useContext(loginFlowContext)

    if (context === undefined) {
        throw new Error("useLoginFlowContext must be used within a LoginFlow")
    }

    return context
}
