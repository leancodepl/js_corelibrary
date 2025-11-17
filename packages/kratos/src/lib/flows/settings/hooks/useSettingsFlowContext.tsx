import { createContext, ReactNode, useCallback, useContext, useState } from "react"

type SettingsFlowContext = {
  settingsFlowId?: string
  setSettingsFlowId: (settingsFlowId: string | undefined) => void
  emailVerificationRequired: boolean
  setEmailVerificationRequired: (emailVerificationRequired: boolean) => void
  resetFlow: () => void
}

const settingsFlowContext = createContext<SettingsFlowContext | undefined>(undefined)

export function SettingsFlowProvider({ children }: { children: ReactNode }) {
  const [settingsFlowId, setSettingsFlowId] = useState<string>()
  const [emailVerificationRequired, setEmailVerificationRequired] = useState(false)

  const resetFlow = useCallback(() => {
    setSettingsFlowId(undefined)
  }, [])

  return (
    <settingsFlowContext.Provider
      value={{
        settingsFlowId,
        setSettingsFlowId,
        emailVerificationRequired,
        setEmailVerificationRequired,
        resetFlow,
      }}>
      {children}
    </settingsFlowContext.Provider>
  )
}

export function useSettingsFlowContext() {
  const context = useContext(settingsFlowContext)

  if (context === undefined) {
    throw new Error("useSettingsFlow must be used within a SettingsFlowProvider")
  }

  return context
}
