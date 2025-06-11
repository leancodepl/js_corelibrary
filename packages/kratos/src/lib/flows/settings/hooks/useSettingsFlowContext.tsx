import { createContext, ReactNode, useCallback, useContext, useState } from "react"

type SettingsFlowContext = {
    settingsFlowId?: string
    setSettingsFlowId: (settingsFlowId: string | undefined) => void
    resetContext: () => void
}

const settingsFlowContext = createContext<SettingsFlowContext | undefined>(undefined)

export function SettingsFlowProvider({ children }: { children: ReactNode }) {
    const [settingsFlowId, setSettingsFlowId] = useState<string>()

    const resetContext = useCallback(() => {
        setSettingsFlowId(undefined)
    }, [])

    return (
        <settingsFlowContext.Provider
            value={{
                settingsFlowId,
                setSettingsFlowId,
                resetContext,
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
