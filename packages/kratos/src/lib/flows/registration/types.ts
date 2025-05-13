import { AuthError } from "../../utils"
import { InputFields as EmailVerificationInputFields } from "./emailVerificationForm/types"
import { InputFields as RegisterFormInputFields } from "./registerForm/types"

export type OnRegistrationFlowError = (props: {
    target: "root" | `${EmailVerificationInputFields}` | `${RegisterFormInputFields}` | `traits.${string}`
    errors: AuthError[]
}) => Promise<void> | void

type typeofKratosTraitValue = {
    string: string
    boolean: boolean
}

export type TraitsConfig = Record<string, { trait: string; type: keyof typeofKratosTraitValue }>
