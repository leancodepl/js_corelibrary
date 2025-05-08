import { AuthError } from "../../utils"
import { InputFields } from "./registerForm/types"

export type OnRegistrationFlowError = (props: {
    target: "root" | `${InputFields}` | `traits.${string}`
    errors: AuthError[]
}) => Promise<void> | void

type typeofKratosTraitValue = {
    string: string
    boolean: boolean
}

export type TraitsConfig = Record<string, { trait: string; type: keyof typeofKratosTraitValue }>
