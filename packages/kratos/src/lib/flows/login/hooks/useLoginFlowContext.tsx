import { createContext, ReactNode, useCallback, useContext, useState } from "react"

type LoginFlowContext = {
    loginFlowId?: string
    setLoginFlowId: (loginFlowId: string | undefined) => void
    resetContext: () => void
}

const loginFlowContext = createContext<LoginFlowContext | undefined>(undefined)

export function LoginFlowProvider({ children }: { children: ReactNode }) {
    const [loginFlowId, setLoginFlowId] = useState<string>()

    const resetContext = useCallback(() => {
        setLoginFlowId(undefined)
    }, [])

    return (
        <loginFlowContext.Provider
            value={{
                loginFlowId,
                setLoginFlowId,
                resetContext,
            }}>
            {children}
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
