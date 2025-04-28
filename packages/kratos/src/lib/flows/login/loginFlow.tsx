import { ComponentType, createContext, useContext, useEffect, useMemo, useState } from "react"
import { Configuration, FrontendApi } from "../../kratos"
import { ChooseMethodFormProps, ChooseMethodFormWrapper } from "./chooseMethodForm"
import { useCreateLoginFlow, useGetLoginFlow } from "./hooks"
import { SecondFactorEmailFormProps, SecondFactorEmailFormWrapper } from "./secondFactorEmailForm"
import { SecondFactorFormProps, SecondFactorFormWrapper } from "./secondFactorForm"

type KratosContext = { kratosClient: FrontendApi; loginFlowId?: string; setLoginFlowId: (loginFlowId?: string) => void }

const kratosContext = createContext<KratosContext | undefined>(undefined)

export function KratosContextProvider({ children, baseUrl }: { children: React.ReactNode; baseUrl: string }) {
    const [kratosClient] = useState(() => new FrontendApi(new Configuration({ basePath: baseUrl })))

    const [loginFlowId, setLoginFlowId] = useState<string>()

    const kratosContextData = useMemo<KratosContext>(
        () => ({ kratosClient, loginFlowId, setLoginFlowId }),
        [kratosClient, loginFlowId, setLoginFlowId],
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
}

export function KratosLoginFlow({
    chooseMethodForm: ChooseMethodForm,
    secondFactorForm: SecondFactorForm,
    secondFactorEmailForm: SecondFactorEmailForm,
    initialFlowId,
    returnTo,
}: LoginFlowProps) {
    const { loginFlowId, setLoginFlowId } = useKratosContext()

    const { mutate: createLoginFlow } = useCreateLoginFlow({ returnTo, refresh: true, aal: "aal2" })
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
            {step === "chooseMethod" && <ChooseMethodFormWrapper chooseMethodForm={ChooseMethodForm} />}
            {step === "secondFactor" && <SecondFactorFormWrapper secondFactorForm={SecondFactorForm} />}
            {step === "secondFactorEmail" && <SecondFactorEmailFormWrapper secondFactorForm={SecondFactorEmailForm} />}
        </>
    )
}
