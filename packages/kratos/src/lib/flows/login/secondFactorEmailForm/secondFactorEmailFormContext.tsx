import { createContext, ReactNode, useContext, useMemo } from "react"
import { useCodeForm } from "./useCodeForm"

export type SecondFactorEmailFormContextData = {
  codeForm: ReturnType<typeof useCodeForm>
}

const secondFactorEmailFormContext = createContext<SecondFactorEmailFormContextData | undefined>(undefined)

export function SecondFactorEmailFormProvider({
  children,
  codeForm,
}: {
  children: ReactNode
  codeForm: ReturnType<typeof useCodeForm>
}) {
  const secondFactorEmailFormContextData = useMemo<SecondFactorEmailFormContextData>(() => ({ codeForm }), [codeForm])

  return (
    <secondFactorEmailFormContext.Provider value={secondFactorEmailFormContextData}>
      {children}
    </secondFactorEmailFormContext.Provider>
  )
}

export function useSecondFactorEmailFormContext() {
  const context = useContext(secondFactorEmailFormContext)

  if (context === undefined) {
    throw new Error("useSecondFactorEmailFormContext must be used within a SecondFactorEmailFormProvider")
  }

  return context
}
