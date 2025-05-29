import { OnFlowError } from "../../utils"
import { traitPrefix } from "./config"
import { InputFields as NewPasswordFormInputFields } from "./newPasswordForm/types"
import { InputFields as TotpFormInputFields } from "./totpForm/types"

export type OnSettingsFlowError = OnFlowError<
    `${NewPasswordFormInputFields}` | `${TotpFormInputFields}` | `${typeof traitPrefix}${string}`
>

type typeofKratosTraitValue = {
    string: string
    boolean: boolean
}

export type TraitsConfig = Record<string, { trait: string; type: keyof typeofKratosTraitValue }>
