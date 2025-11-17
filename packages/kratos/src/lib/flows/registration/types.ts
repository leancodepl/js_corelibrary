import { verificationFlow } from ".."
import { OnFlowError, traitPrefix, TraitsConfig } from "../../utils"
import { InputFields as ChooseMethodInputFields } from "./chooseMethodForm/types"

export type OnRegistrationFlowError<TTraitsConfig extends TraitsConfig> = OnFlowError<
  `${ChooseMethodInputFields}` | `${typeof traitPrefix}${TTraitsConfig[keyof TTraitsConfig]["trait"]}`
> &
  verificationFlow.OnVerificationFlowError
