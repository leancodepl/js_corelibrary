import { createContext, useContext } from "react"
import { useCodeForm } from "./useCodeForm"

export type SecondFactorEmailFormContextData = {
    codeForm: ReturnType<typeof useCodeForm>
}

export const secondFactorEmailFormContext = createContext<SecondFactorEmailFormContextData>(undefined as any)

export function useSecondFactorEmailFormContext() {
    return useContext(secondFactorEmailFormContext)
}
