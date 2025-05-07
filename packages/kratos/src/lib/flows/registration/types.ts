import { AuthError } from "../../utils"
import { InputFields } from "./registerForm/types"

export type OnRegistrationFlowError = (props: {
    target: "root" | `${InputFields}` | `traits.${string}`
    errors: AuthError[]
}) => Promise<void> | void
