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

/**
 * Accesses the settings flow context for managing user account settings state.
 *
 * Provides access to settings flow ID, email verification requirement state, and flow
 * reset functionality. Must be used within a SettingsFlowProvider context.
 *
 * @returns Object containing settings flow state and control functions
 * @throws {Error} When used outside of SettingsFlowProvider context
 * @example
 * ```typescript
 * import { useSettingsFlowContext } from "@leancodepl/kratos";
 *
 * function SettingsComponent() {
 *   const { settingsFlowId, emailVerificationRequired, resetFlow } = useSettingsFlowContext();
 *
 *   return (
 *     <div>
 *       <p>Flow ID: {settingsFlowId}</p>
 *       {emailVerificationRequired && <p>Email verification required</p>}
 *       <button onClick={resetFlow}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSettingsFlowContext() {
    const context = useContext(settingsFlowContext)

    if (context === undefined) {
        throw new Error("useSettingsFlow must be used within a SettingsFlowProvider")
    }

    return context
}
