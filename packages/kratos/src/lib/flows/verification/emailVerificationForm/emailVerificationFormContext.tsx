import { createContext, ReactNode, useContext, useMemo } from "react"
import { useEmailVerificationForm } from "./useEmailVerificationForm"

export type EmailVerificationFormContextData = {
    emailVerificationForm: ReturnType<typeof useEmailVerificationForm>
}

const emailVerificationFormContext = createContext<EmailVerificationFormContextData | undefined>(undefined)

export function EmailVerificationFormProvider({
    children,
    emailVerificationForm,
}: {
    children: ReactNode
    emailVerificationForm: ReturnType<typeof useEmailVerificationForm>
}) {
    const emailVerificationFormContextData = useMemo<EmailVerificationFormContextData>(
        () => ({ emailVerificationForm }),
        [emailVerificationForm],
    )

    return (
        <emailVerificationFormContext.Provider value={emailVerificationFormContextData}>
            {children}
        </emailVerificationFormContext.Provider>
    )
}

export function useEmailVerificationFormContext() {
    const context = useContext(emailVerificationFormContext)

    if (context === undefined) {
        throw new Error("useEmailVerificationFormContext must be used within a EmailVerificationFormProvider")
    }

    return context
}
