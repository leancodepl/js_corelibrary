import { AuthError } from "../../utils"
import { InputFields as ChooseMethodInputFields } from "./chooseMethodForm/types"
import { InputFields as EmailVerificationInputFields } from "./emailVerificationForm/types"

export type OnRegistrationFlowError = (props: {
    target: "root" | `${ChooseMethodInputFields}` | `${EmailVerificationInputFields}` | `traits.${string}`
    errors: AuthError[]
}) => Promise<void> | void

type typeofKratosTraitValue = {
    string: string
    boolean: boolean
}

export type TraitsConfig = Record<string, { trait: string; type: keyof typeofKratosTraitValue }>
