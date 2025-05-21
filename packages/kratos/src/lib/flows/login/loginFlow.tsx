import { ComponentType, createContext, useContext, useMemo, useState } from "react"
import { ChooseMethodFormProps, ChooseMethodFormWrapper } from "./chooseMethodForm"
import { useCreateLoginFlow, useGetLoginFlow } from "./hooks"
import { SecondFactorEmailFormProps, SecondFactorEmailFormWrapper } from "./secondFactorEmailForm"
import { SecondFactorFormProps, SecondFactorFormWrapper } from "./secondFactorForm"
import { OnLoginFlowError } from "./types"

export type LoginFlowProps = {
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    secondFactorForm: ComponentType<SecondFactorFormProps>
    secondFactorEmailForm: ComponentType<SecondFactorEmailFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnLoginFlowError
}

function LoginFlowWrapper({
    chooseMethodForm: ChooseMethodForm,
    secondFactorForm: SecondFactorForm,
    secondFactorEmailForm: SecondFactorEmailForm,
    initialFlowId,
    returnTo,
    onError,
}: LoginFlowProps) {
    const { loginFlowId, setLoginFlowId } = useLoginFlowContext()

    const { mutate: createLoginFlow } = useCreateLoginFlow({ returnTo })
    const { data: loginFlow } = useGetLoginFlow()

    if (!loginFlowId) {
        if (initialFlowId) {
            setLoginFlowId(initialFlowId)
        } else {
            createLoginFlow()
        }
    }

    const step = useMemo(() => {
        if (!loginFlow) return "chooseMethod"

        if (loginFlow.state === "choose_method") {
            if (loginFlow.requested_aal === "aal1") return "chooseMethod"
            if (loginFlow.requested_aal === "aal2") return "secondFactor"
        }

        if (loginFlow.state === "sent_email") return "secondFactorEmail"

        throw new Error("Invalid login flow state")
    }, [loginFlow])

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
        </>
    )
}

type LoginFlowContext = {
    loginFlowId?: string
    setLoginFlowId: (loginFlowId: string | undefined) => void
}

const loginFlowContext = createContext<LoginFlowContext | undefined>(undefined)

export function LoginFlow(props: LoginFlowProps) {
    const [loginFlowId, setLoginFlowId] = useState<string>()

    return (
        <loginFlowContext.Provider value={{ loginFlowId, setLoginFlowId }}>
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
