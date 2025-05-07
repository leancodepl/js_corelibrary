import { ComponentType, createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"
import { Configuration, FrontendApi } from "../../kratos"
import { ChooseMethodFormProps, ChooseMethodFormWrapper } from "./chooseMethodForm"
import { useCreateLoginFlow, useGetLoginFlow } from "./hooks"
import { SecondFactorEmailFormProps, SecondFactorEmailFormWrapper } from "./secondFactorEmailForm"
import { SecondFactorFormProps, SecondFactorFormWrapper } from "./secondFactorForm"
import { OnLoginFlowError } from "./types"

type KratosContext = {
    kratosClient: FrontendApi
    loginFlowId?: string
    setLoginFlowId: (loginFlowId?: string) => void
    registrationFlowId?: string
    setRegistrationFlowId: (registrationFlowId?: string) => void
}

const kratosContext = createContext<KratosContext | undefined>(undefined)

type KratosContextProviderProps = {
    children: ReactNode
    baseUrl: string
}

export function KratosContextProvider({ children, baseUrl }: KratosContextProviderProps) {
    const [kratosClient] = useState(() => new FrontendApi(new Configuration({ basePath: baseUrl })))

    const [loginFlowId, setLoginFlowId] = useState<string>()
    const [registrationFlowId, setRegistrationFlowId] = useState<string>()

    const kratosContextData = useMemo<KratosContext>(
        () => ({ kratosClient, loginFlowId, setLoginFlowId, registrationFlowId, setRegistrationFlowId }),
        [kratosClient, loginFlowId, registrationFlowId],
    )

    return <kratosContext.Provider value={kratosContextData}>{children}</kratosContext.Provider>
}

export function useKratosContext() {
    const context = useContext(kratosContext)

    if (context === undefined) {
        throw new Error("useKratosContext must be used within a KratosContextProvider")
    }

    return context
}

type LoginFlowProps = {
    chooseMethodForm: ComponentType<ChooseMethodFormProps>
    secondFactorForm: ComponentType<SecondFactorFormProps>
    secondFactorEmailForm: ComponentType<SecondFactorEmailFormProps>
    initialFlowId?: string
    returnTo?: string
    onError?: OnLoginFlowError
}

export function KratosLoginFlow({
    chooseMethodForm: ChooseMethodForm,
    secondFactorForm: SecondFactorForm,
    secondFactorEmailForm: SecondFactorEmailForm,
    initialFlowId,
    returnTo,
    onError,
}: LoginFlowProps) {
    const { loginFlowId, setLoginFlowId } = useKratosContext()

    const { mutate: createLoginFlow } = useCreateLoginFlow({ returnTo })
    const { data: loginFlow } = useGetLoginFlow()

    useEffect(() => {
        if (loginFlowId) return

        if (initialFlowId) {
            setLoginFlowId(initialFlowId)
        } else {
            createLoginFlow()
        }
    }, [createLoginFlow, loginFlowId, initialFlowId, setLoginFlowId])

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
