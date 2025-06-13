import { OnFlowError, traitPrefix, TraitsConfig } from "../../utils"
import { InputFields as NewPasswordFormInputFields } from "./newPasswordForm/types"
import { InputFields as TotpFormInputFields } from "./totpForm/types"

export type OnSettingsFlowError<TTraitsConfig extends TraitsConfig> = OnFlowError<
    | `${NewPasswordFormInputFields}`
    | `${TotpFormInputFields}`
    | `${typeof traitPrefix}${TTraitsConfig[keyof TTraitsConfig]["trait"]}`
>
