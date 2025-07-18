import { createContext, ReactNode, useContext, useMemo } from "react"
import { useNewPasswordForm } from "./useNewPasswordForm"

export type NewPasswordFormContextData = {
    newPasswordForm: ReturnType<typeof useNewPasswordForm>
}

const newPasswordFormContext = createContext<NewPasswordFormContextData | undefined>(undefined)

export function NewPasswordFormProvider({
    children,
    newPasswordForm,
}: {
    children: ReactNode
    newPasswordForm: ReturnType<typeof useNewPasswordForm>
}) {
    const newPasswordFormContextData = useMemo<NewPasswordFormContextData>(
        () => ({ newPasswordForm }),
        [newPasswordForm],
    )

    return (
        <newPasswordFormContext.Provider value={newPasswordFormContextData}>
            {children}
        </newPasswordFormContext.Provider>
    )
}

export function useNewPasswordFormContext() {
    const context = useContext(newPasswordFormContext)

    if (context === undefined) {
        throw new Error("useNewPasswordFormContext must be used within a NewPasswordFormProvider")
    }

    return context
}
