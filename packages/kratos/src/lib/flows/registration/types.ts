import { verificationFlow } from ".."
import { OnFlowError, traitPrefix } from "../../utils"
import { InputFields as ChooseMethodInputFields } from "./chooseMethodForm/types"

export type OnRegistrationFlowError = OnFlowError<`${ChooseMethodInputFields}` | `${typeof traitPrefix}${string}`> &
    verificationFlow.OnVerificationFlowError
