import { OnFlowError } from "../../utils"
import { InputFields as EmailVerificationInputFields } from "./emailVerificationForm/types"

export type OnVerificationFlowError = OnFlowError<`${EmailVerificationInputFields}`>
