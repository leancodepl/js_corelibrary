import { createContext, ReactNode, useCallback, useContext, useState } from "react"

type RegistrationFlowContext = {
    registrationFlowId?: string
    setRegistrationFlowId: (registrationFlowId: string | undefined) => void
    traitsFormCompleted: boolean
    setTraitsFormCompleted: (traitsFormCompleted: boolean) => void
    traits: Record<string, boolean | string> | undefined
    setTraits: (traits: Record<string, boolean | string> | undefined) => void
    resetFlow: () => void
}

const registrationFlowContext = createContext<RegistrationFlowContext | undefined>(undefined)

export function RegistrationFlowProvider({ children }: { children: ReactNode }) {
    const [registrationFlowId, setRegistrationFlowId] = useState<string>()

    const [traitsFormCompleted, setTraitsFormCompleted] = useState(false)
    const [traits, setTraits] = useState<Record<string, boolean | string> | undefined>(undefined)

    const resetFlow = useCallback(() => {
        setRegistrationFlowId(undefined)
        setTraitsFormCompleted(false)
        setTraits(undefined)
    }, [])

    return (
        <registrationFlowContext.Provider
            value={{
                registrationFlowId,
                setRegistrationFlowId,
                traitsFormCompleted,
                setTraitsFormCompleted,
                traits,
                setTraits,
                resetFlow,
            }}>
            {children}
        </registrationFlowContext.Provider>
    )
}

export function useRegistrationFlowContext() {
    const context = useContext(registrationFlowContext)

    if (context === undefined) {
        throw new Error("useRegistrationFlowContext must be used within a RegistrationFlow")
    }

    return context
}
