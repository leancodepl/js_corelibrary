import { createContext, ReactNode, useContext, useMemo, useState } from "react"
import { Configuration, FrontendApi } from "../kratos"

type KratosContext = {
    kratosClient: FrontendApi
}

const kratosContext = createContext<KratosContext | undefined>(undefined)

type KratosContextProviderProps = {
    children: ReactNode
    baseUrl: string
}

export function KratosContextProvider({ children, baseUrl }: KratosContextProviderProps) {
    const [kratosClient] = useState(() => new FrontendApi(new Configuration({ basePath: baseUrl })))

    const kratosContextData = useMemo<KratosContext>(() => ({ kratosClient }), [kratosClient])

    return <kratosContext.Provider value={kratosContextData}>{children}</kratosContext.Provider>
}

export function useKratosContext() {
    const context = useContext(kratosContext)

    if (context === undefined) {
        throw new Error("useKratosContext must be used within a KratosContextProvider")
    }

    return context
}
