import { OnFlowError } from "../../utils"
import { InputFields as ChooseMethodInputFields } from "./chooseMethodForm/types"
import { InputFields as EmailVerificationInputFields } from "./emailVerificationForm/types"

export type OnRegistrationFlowError = OnFlowError<
    `${ChooseMethodInputFields}` | `${EmailVerificationInputFields}` | `traits.${string}`
>

type typeofKratosTraitValue = {
    string: string
    boolean: boolean
}

export type TraitsConfig = Record<string, { trait: string; type: keyof typeofKratosTraitValue }>
