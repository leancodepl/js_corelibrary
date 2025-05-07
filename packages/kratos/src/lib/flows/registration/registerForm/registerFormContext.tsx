import { createContext, ReactNode, useContext, useMemo } from "react"
import { usePasswordForm } from "./usePasswordForm"

export type RegisterFormContextData = {
    passwordForm: ReturnType<typeof usePasswordForm>
}

const registerFormContext = createContext<RegisterFormContextData | undefined>(undefined)

export function RegisterFormProvider({
    children,
    passwordForm,
}: {
    children: ReactNode
    passwordForm: ReturnType<typeof usePasswordForm>
}) {
    const registerFormContextData = useMemo<RegisterFormContextData>(() => ({ passwordForm }), [passwordForm])

    return <registerFormContext.Provider value={registerFormContextData}>{children}</registerFormContext.Provider>
}

export function useRegisterFormContext() {
    const context = useContext(registerFormContext)

    if (context === undefined) {
        throw new Error("useRegisterFormContext must be used within a RegisterFormProvider")
    }

    return context
}
