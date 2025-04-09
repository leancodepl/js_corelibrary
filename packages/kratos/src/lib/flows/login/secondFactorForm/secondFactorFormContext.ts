import { createContext, useContext } from "react"
import { useTotpForm } from "./useTotpForm"

export type SecondFactorFormContextData = {
    totpForm: ReturnType<typeof useTotpForm>
}

export const secondFactorFormContext = createContext<SecondFactorFormContextData>(undefined as any)

export function useSecondFactorFormContext() {
    return useContext(secondFactorFormContext)
}
