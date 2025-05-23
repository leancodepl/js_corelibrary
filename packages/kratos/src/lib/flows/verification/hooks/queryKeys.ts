import { createQueryKey, withPrefix } from "../../../utils"

const baseKey = withPrefix("verification_flow")

export const verificationFlowKey = (id = "no_id") => createQueryKey([baseKey, id] as const)
