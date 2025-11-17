import { createContext, ReactNode, useContext, useMemo } from "react"
import { useEmailForm } from "./useEmailForm"

export type EmailFormContextData = {
  emailForm: ReturnType<typeof useEmailForm>
}

const emailFormContext = createContext<EmailFormContextData | undefined>(undefined)

export function EmailFormProvider({
  children,
  emailForm,
}: {
  children: ReactNode
  emailForm: ReturnType<typeof useEmailForm>
}) {
  const emailFormContextData = useMemo<EmailFormContextData>(() => ({ emailForm }), [emailForm])

  return <emailFormContext.Provider value={emailFormContextData}>{children}</emailFormContext.Provider>
}

export function useEmailFormContext() {
  const context = useContext(emailFormContext)

  if (context === undefined) {
    throw new Error("useEmailFormContext must be used within a EmailFormProvider")
  }

  return context
}
