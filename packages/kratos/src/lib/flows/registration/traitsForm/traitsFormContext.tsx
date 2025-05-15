import { createContext, ReactNode, useContext, useMemo } from "react"
import { useTraitsForm } from "./useTraitsForm"

export type TraitsFormContextData = {
    traitsForm: ReturnType<typeof useTraitsForm>
}

const traitsFormContext = createContext<TraitsFormContextData | undefined>(undefined)

export function TraitsFormProvider({
    children,
    traitsForm,
}: {
    children: ReactNode
    traitsForm: ReturnType<typeof useTraitsForm>
}) {
    const traitsFormContextData = useMemo<TraitsFormContextData>(() => ({ traitsForm }), [traitsForm])

    return <traitsFormContext.Provider value={traitsFormContextData}>{children}</traitsFormContext.Provider>
}

export function useTraitsFormContext() {
    const context = useContext(traitsFormContext)

    if (context === undefined) {
        throw new Error("useTraitsFormContext must be used within a TraitsFormProvider")
    }

    return context
}
