import { OnFlowError } from "../../utils"
import { InputFields as NewPasswordFormInputFields } from "../settings/newPasswordForm/types"
import { InputFields as CodeFormInputFields } from "./codeForm/types"
import { InputFields as EmailFormInputFields } from "./emailForm/types"

export type OnRecoveryFlowError = OnFlowError<
    `${CodeFormInputFields}` | `${EmailFormInputFields} | ${NewPasswordFormInputFields}`
>
