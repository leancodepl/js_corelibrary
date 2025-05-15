import { AuthError } from "../../utils"
import { InputFields as ChooseMethodFormInputFields } from "./chooseMethodForm/types"
import { InputFields as secondFactorEmailFormInputFields } from "./secondFactorEmailForm/types"
import { InputFields as SecondFactorFormInputFields } from "./secondFactorForm/types"

export type OnLoginFlowError = (props: {
    target:
        | "root"
        | `${ChooseMethodFormInputFields}`
        | `${secondFactorEmailFormInputFields}`
        | `${SecondFactorFormInputFields}`
    errors: AuthError[]
}) => Promise<void> | void
