import { createQueryKey, withQueryKeyPrefix } from "../../../utils"

const baseKey = withQueryKeyPrefix("verification_flow")

export const verificationFlowKey = (id = "no_id") => createQueryKey([baseKey, id] as const)
