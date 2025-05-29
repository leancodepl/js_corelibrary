import { createContext, ReactNode, useContext, useMemo } from "react"
import { useTotpForm } from "./useTotpForm"

export type TotpFormContextData = {
    totpForm: ReturnType<typeof useTotpForm>
}

const totpFormContext = createContext<TotpFormContextData | undefined>(undefined)

export function TotpFormProvider({
    children,
    totpForm,
}: {
    children: ReactNode
    totpForm: ReturnType<typeof useTotpForm>
}) {
    const totpFormContextData = useMemo<TotpFormContextData>(() => ({ totpForm }), [totpForm])

    return <totpFormContext.Provider value={totpFormContextData}>{children}</totpFormContext.Provider>
}

export function useTotpFormContext() {
    const context = useContext(totpFormContext)

    if (context === undefined) {
        throw new Error("useTotpFormContext must be used within a TotpFormProvider")
    }

    return context
}
