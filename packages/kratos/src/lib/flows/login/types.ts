import { OnFlowError } from "../../utils"
import { InputFields as ChooseMethodFormInputFields } from "./chooseMethodForm/types"
import { InputFields as EmailVerificationInputFields } from "./emailVerificationForm/types"
import { InputFields as SecondFactorEmailFormInputFields } from "./secondFactorEmailForm/types"
import { InputFields as SecondFactorFormInputFields } from "./secondFactorForm/types"

export type OnLoginFlowError = OnFlowError<
    | `${ChooseMethodFormInputFields}`
    | `${EmailVerificationInputFields}`
    | `${SecondFactorEmailFormInputFields}`
    | `${SecondFactorFormInputFields}`
>
