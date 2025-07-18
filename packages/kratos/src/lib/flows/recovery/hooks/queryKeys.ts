import { createQueryKey, withQueryKeyPrefix } from "../../../utils"

const baseKey = withQueryKeyPrefix("recovery_flow")

export const recoveryFlowKey = (id = "no_id") => createQueryKey([baseKey, id] as const)
