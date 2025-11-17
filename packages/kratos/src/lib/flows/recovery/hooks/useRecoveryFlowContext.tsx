import { createContext, ReactNode, useCallback, useContext, useState } from "react"

type RecoveryFlowContext = {
  recoveryFlowId?: string
  setRecoveryFlowId: (recoveryFlowId: string | undefined) => void
  resetFlow: () => void
}

const recoveryFlowContext = createContext<RecoveryFlowContext | undefined>(undefined)

export function RecoveryFlowProvider({ children }: { children: ReactNode }) {
  const [recoveryFlowId, setRecoveryFlowId] = useState<string>()

  const resetFlow = useCallback(() => {
    setRecoveryFlowId(undefined)
  }, [])

  return (
    <recoveryFlowContext.Provider
      value={{
        recoveryFlowId,
        setRecoveryFlowId,
        resetFlow,
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
