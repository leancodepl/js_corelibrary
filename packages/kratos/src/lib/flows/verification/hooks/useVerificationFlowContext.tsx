import { createContext, ReactNode, useCallback, useContext, useState } from "react"

type VerificationFlowContext = {
    verificationFlowId?: string
    setVerificationFlowId: (verificationFlowId: string | undefined) => void
    verifiableAddress?: string
    setVerifiableAddress: (verifiableAddress: string | undefined) => void
    resetContext: () => void
}

const verificationFlowContext = createContext<VerificationFlowContext | undefined>(undefined)

export function VerificationFlowProvider({ children }: { children: ReactNode }) {
    const [verificationFlowId, setVerificationFlowId] = useState<string>()
    const [verifiableAddress, setVerifiableAddress] = useState<string>()

    const resetContext = useCallback(() => {
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
                resetContext,
            }}>
            {children}
        </verificationFlowContext.Provider>
    )
}

export function useVerificationFlowContext() {
    const context = useContext(verificationFlowContext)

    if (context === undefined) {
        throw new Error("useVerificationFlow must be used within a VerificationFlowProvider")
    }

    return context
}
