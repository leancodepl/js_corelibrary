import { createContext, useContext } from "react"
import { usePasswordForm } from "./usePasswordForm"

export type ChooseMethodFormContextData = {
    passwordForm: ReturnType<typeof usePasswordForm>
}

export const chooseMethodFormContext = createContext<ChooseMethodFormContextData>(undefined as any)

export function useChooseMethodFormContext() {
    return useContext(chooseMethodFormContext)
}
