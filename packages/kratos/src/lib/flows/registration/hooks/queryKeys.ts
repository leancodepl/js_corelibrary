import { createQueryKey, withPrefix } from "../../../utils"

const baseKey = withPrefix("registration_flow")

export const registrationFlowKey = (id = "no_id") => createQueryKey([baseKey, id] as const)
