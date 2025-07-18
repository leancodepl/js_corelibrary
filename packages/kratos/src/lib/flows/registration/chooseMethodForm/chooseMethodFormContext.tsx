import { createContext, ReactNode, useContext, useMemo } from "react"
import { useChooseMethodForm } from "./useChooseMethodForm"

export type ChooseMethodFormContextData = {
    chooseMethodForm: ReturnType<typeof useChooseMethodForm>
}

const chooseMethodFormContext = createContext<ChooseMethodFormContextData | undefined>(undefined)

export function ChooseMethodFormProvider({
    children,
    chooseMethodForm,
}: {
    children: ReactNode
    chooseMethodForm: ReturnType<typeof useChooseMethodForm>
}) {
    const chooseMethodFormContextData = useMemo<ChooseMethodFormContextData>(
        () => ({ chooseMethodForm }),
        [chooseMethodForm],
    )

    return (
        <chooseMethodFormContext.Provider value={chooseMethodFormContextData}>
            {children}
        </chooseMethodFormContext.Provider>
    )
}

export function useChooseMethodFormContext() {
    const context = useContext(chooseMethodFormContext)

    if (context === undefined) {
        throw new Error("useChooseMethodFormContext must be used within a ChooseMethodFormProvider")
    }

    return context
}
