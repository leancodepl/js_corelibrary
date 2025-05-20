import { OnFlowError } from "../../utils"
import { InputFields as ChooseMethodInputFields } from "./chooseMethodForm/types"
import { traitPrefix } from "./config"

export type OnRegistrationFlowError = OnFlowError<`${ChooseMethodInputFields}` | `${typeof traitPrefix}${string}`>

type typeofKratosTraitValue = {
    string: string
    boolean: boolean
}

export type TraitsConfig = Record<string, { trait: string; type: keyof typeofKratosTraitValue }>
