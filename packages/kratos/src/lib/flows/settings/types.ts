import { OnFlowError } from "../../utils"
import { InputFields as NewPasswordFormInputFields } from "./newPasswordForm/types"

export type OnSettingsFlowError = OnFlowError<`${NewPasswordFormInputFields}`>
