import { settingsFlow } from ".."
import { OnFlowError } from "../../utils"
import { InputFields as CodeFormInputFields } from "./codeForm/types"
import { InputFields as EmailFormInputFields } from "./emailForm/types"

export type OnRecoveryFlowError = OnFlowError<`${CodeFormInputFields}` | `${EmailFormInputFields}`> &
    settingsFlow.OnSettingsFlowError
// TODO specify only errors from new password form and not the entire settings flow
