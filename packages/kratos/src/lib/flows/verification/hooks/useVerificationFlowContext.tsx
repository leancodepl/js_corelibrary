import { createContext, ReactNode, useCallback, useContext, useState } from "react"

type VerificationFlowContext = {
    verificationFlowId?: string
    setVerificationFlowId: (verificationFlowId: string | undefined) => void
    verifiableAddress?: string
    setVerifiableAddress: (verifiableAddress: string | undefined) => void
    resetFlow: () => void
}

const verificationFlowContext = createContext<VerificationFlowContext | undefined>(undefined)

export function VerificationFlowProvider({ children }: { children: ReactNode }) {
    const [verificationFlowId, setVerificationFlowId] = useState<string>()
    const [verifiableAddress, setVerifiableAddress] = useState<string>()

    const resetFlow = useCallback(() => {
        setVerificationFlowId(undefined)
        setVerifiableAddress(undefined)
    }, [])

    return (
        <verificationFlowContext.Provider
            value={{
                verificationFlowId,
                setVerificationFlowId,
                verifiableAddress,
                setVerifiableAddress,
                resetFlow,
            }}>
            {children}
        </verificationFlowContext.Provider>
    )
}

/**
 * Accesses the verification flow context for managing email verification state.
 *
 * Provides access to verification flow ID, verifiable address state, and flow reset
 * functionality. Must be used within a VerificationFlowProvider context.
 *
 * @returns Object containing verification flow state and control functions
 * @throws {Error} When used outside of VerificationFlowProvider context
 * @example
 * ```typescript
 * import { useVerificationFlowContext } from "@leancodepl/kratos";
 *
 * function VerificationComponent() {
 *   const { verificationFlowId, verifiableAddress, resetFlow } = useVerificationFlowContext();
 *
 *   return (
 *     <div>
 *       <p>Flow ID: {verificationFlowId}</p>
 *       <p>Email: {verifiableAddress}</p>
 *       <button onClick={resetFlow}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useVerificationFlowContext() {
    const context = useContext(verificationFlowContext)

    if (context === undefined) {
        throw new Error("useVerificationFlow must be used within a VerificationFlowProvider")
    }

    return context
}
