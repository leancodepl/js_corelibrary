import { OnFlowError, traitPrefix } from "../../utils"
import { InputFields as NewPasswordFormInputFields } from "./newPasswordForm/types"
import { InputFields as TotpFormInputFields } from "./totpForm/types"

export type OnSettingsFlowError = OnFlowError<
    `${NewPasswordFormInputFields}` | `${TotpFormInputFields}` | `${typeof traitPrefix}${string}`
>
