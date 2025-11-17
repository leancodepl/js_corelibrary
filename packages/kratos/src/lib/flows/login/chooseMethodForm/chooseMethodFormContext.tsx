import { createContext, ReactNode, useContext, useMemo } from "react"
import { usePasswordForm } from "./usePasswordForm"

export type ChooseMethodFormContextData = {
  passwordForm: ReturnType<typeof usePasswordForm>
}

const chooseMethodFormContext = createContext<ChooseMethodFormContextData | undefined>(undefined)

export function ChooseMethodFormProvider({
  children,
  passwordForm,
}: {
  children: ReactNode
  passwordForm: ReturnType<typeof usePasswordForm>
}) {
  const chooseMethodFormContextData = useMemo<ChooseMethodFormContextData>(() => ({ passwordForm }), [passwordForm])

  return (
    <chooseMethodFormContext.Provider value={chooseMethodFormContextData}>{children}</chooseMethodFormContext.Provider>
  )
}

export function useChooseMethodFormContext() {
  const context = useContext(chooseMethodFormContext)

  if (context === undefined) {
    throw new Error("useChooseMethodFormContext must be used within a ChooseMethodFormProvider")
  }

  return context
}
