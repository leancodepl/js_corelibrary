import { createContext, ReactNode, useContext, useMemo } from "react"
import { useCodeForm } from "./useCodeForm"

export type CodeFormContextData = {
  codeForm: ReturnType<typeof useCodeForm>
}

const codeFormContext = createContext<CodeFormContextData | undefined>(undefined)

export function CodeFormProvider({
  children,
  codeForm,
}: {
  children: ReactNode
  codeForm: ReturnType<typeof useCodeForm>
}) {
  const codeFormContextData = useMemo<CodeFormContextData>(() => ({ codeForm }), [codeForm])

  return <codeFormContext.Provider value={codeFormContextData}>{children}</codeFormContext.Provider>
}

export function useCodeFormContext() {
  const context = useContext(codeFormContext)

  if (context === undefined) {
    throw new Error("useCodeFormContext must be used within a CodeFormProvider")
  }

  return context
}
