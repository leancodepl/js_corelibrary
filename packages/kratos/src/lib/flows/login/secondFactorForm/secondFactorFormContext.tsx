import { createContext, ReactNode, useContext, useMemo } from "react"
import { useTotpForm } from "./useTotpForm"

export type SecondFactorFormContextData = {
  totpForm: ReturnType<typeof useTotpForm>
}

const secondFactorFormContext = createContext<SecondFactorFormContextData | undefined>(undefined)

export const SecondFactorFormProvider = ({
  children,
  totpForm,
}: {
  children: ReactNode
  totpForm: ReturnType<typeof useTotpForm>
}) => {
  const secondFactorFormContextData = useMemo<SecondFactorFormContextData>(() => ({ totpForm }), [totpForm])

  return (
    <secondFactorFormContext.Provider value={secondFactorFormContextData}>{children}</secondFactorFormContext.Provider>
  )
}

export function useSecondFactorFormContext() {
  const context = useContext(secondFactorFormContext)

  if (context === undefined) {
    throw new Error("useSecondFactorFormContext must be used within a SecondFactorFormProvider")
  }

  return context
}
