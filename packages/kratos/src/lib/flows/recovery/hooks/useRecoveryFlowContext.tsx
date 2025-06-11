import { createContext, ReactNode, useCallback, useContext, useState } from "react"

type RecoveryFlowContext = {
    recoveryFlowId?: string
    setRecoveryFlowId: (recoveryFlowId: string | undefined) => void
    resetContext: () => void
}

const recoveryFlowContext = createContext<RecoveryFlowContext | undefined>(undefined)

export function RecoveryFlowProvider({ children }: { children: ReactNode }) {
    const [recoveryFlowId, setRecoveryFlowId] = useState<string>()

    const resetContext = useCallback(() => {
        setRecoveryFlowId(undefined)
    }, [])

    return (
        <recoveryFlowContext.Provider
            value={{
                recoveryFlowId,
                setRecoveryFlowId,
                resetContext,
            }}>
            {children}
        </recoveryFlowContext.Provider>
    )
}

export function useRecoveryFlowContext() {
    const context = useContext(recoveryFlowContext)

    if (context === undefined) {
        throw new Error("useRecoveryFlowContext must be used within a RecoveryFlow")
    }

    return context
}
