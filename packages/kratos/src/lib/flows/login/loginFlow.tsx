import { ComponentType, useEffect, useMemo } from "react"
import { useFlowManager, useKratosSessionContext } from "../../hooks"
import { isSessionAlreadyAvailable } from "../../kratos"
import {
    EmailVerificationFormProps,
    useVerificationFlowContext,
    VerificationFlowProvider,
    VerificationFlowWrapper,
} from "../verification"
import { ChooseMethodFormProps, ChooseMethodFormWrapper } from "./chooseMethodForm"
import { LoginFlowProvider, useCreateLoginFlow, useGetLoginFlow, useLoginFlowContext } from "./hooks"
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
    onLoginSuccess?: () => void
    onVerificationSuccess?: () => void
    onFlowRestart?: () => void
    onSessionAlreadyAvailable?: () => void
}

function LoginFlowWrapper({
    chooseMethodForm: ChooseMethodForm,
    secondFactorForm: SecondFactorForm,
    secondFactorEmailForm: SecondFactorEmailForm,
    emailVerificationForm: EmailVerificationForm,
    initialFlowId,
    returnTo,
    onError,
    onLoginSuccess,
    onVerificationSuccess,
    onFlowRestart,
    onSessionAlreadyAvailable,
}: LoginFlowProps) {
    const { loginFlowId, setLoginFlowId } = useLoginFlowContext()
    const { verificationFlowId } = useVerificationFlowContext()
    const { sessionManager } = useKratosSessionContext()
    const { isAal2Required } = sessionManager.useIsAal2Required()
    const { session } = sessionManager.useSession()

    const { mutate: createLoginFlow, error: createLoginFlowError } = useCreateLoginFlow({
        returnTo,
        aal: isAal2Required ? "aal2" : undefined,
    })
    const { data: loginFlow, error: getLoginFlowError } = useGetLoginFlow()

    useFlowManager({
        initialFlowId,
        currentFlowId: loginFlowId,
        error: getLoginFlowError ?? undefined,
        onFlowRestart,
        createFlow: createLoginFlow,
        setFlowId: setLoginFlowId,
    })

    useEffect(() => {
        if (isSessionAlreadyAvailable(createLoginFlowError) || isSessionAlreadyAvailable(getLoginFlowError)) {
            onSessionAlreadyAvailable?.()
        }
    }, [createLoginFlowError, getLoginFlowError, onSessionAlreadyAvailable, session])

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

    const isRefresh = useMemo(() => {
        return loginFlow?.refresh
    }, [loginFlow])

    return (
        <>
            {step === "chooseMethod" && (
                <ChooseMethodFormWrapper
                    chooseMethodForm={ChooseMethodForm}
                    isRefresh={isRefresh}
                    onError={onError}
                    onLoginSuccess={onLoginSuccess}
                />
            )}
            {step === "secondFactor" && (
                <SecondFactorFormWrapper
                    isRefresh={isRefresh}
                    secondFactorForm={SecondFactorForm}
                    onError={onError}
                    onLoginSuccess={onLoginSuccess}
                />
            )}
            {step === "secondFactorEmail" && (
                <SecondFactorEmailFormWrapper
                    secondFactorForm={SecondFactorEmailForm}
                    onError={onError}
                    onLoginSuccess={onLoginSuccess}
                />
            )}
            {step === "verifyEmail" && (
                <VerificationFlowWrapper
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
        <VerificationFlowProvider>
            <LoginFlowProvider>
                <LoginFlowWrapper {...props} />
            </LoginFlowProvider>
        </VerificationFlowProvider>
    )
}
