import { createContext, ReactNode, useContext, useMemo } from "react"
import { TraitsConfig } from "../flows/registration/types"
import { BaseSessionManager } from "../sessionManager"

type KratosSessionContext<TTraitsConfig extends TraitsConfig> = {
    sessionManager: BaseSessionManager<TTraitsConfig>
}

const kratosSessionContext = createContext<KratosSessionContext<any> | undefined>(undefined)

type KratosSessionProviderProps<TTraitsConfig extends TraitsConfig> = {
    children: ReactNode
    sessionManager: BaseSessionManager<TTraitsConfig>
}

export function useKratosSessionContext<TTraitsConfig extends TraitsConfig>() {
    const context = useContext(kratosSessionContext)

    if (context === undefined) {
        throw new Error("useKratosSessionContext must be used within a KratosSessionContextProvider")
    }

    return context as KratosSessionContext<TTraitsConfig>
}

export function KratosSessionProvider<TTraitsConfig extends TraitsConfig>({
    children,
    sessionManager,
}: KratosSessionProviderProps<TTraitsConfig>) {
    const kratosSessionContextData = useMemo<KratosSessionContext<TTraitsConfig>>(
        () => ({ sessionManager }),
        [sessionManager],
    )

    return <kratosSessionContext.Provider value={kratosSessionContextData}>{children}</kratosSessionContext.Provider>
}
