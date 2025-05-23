import { createQueryKey, withPrefix } from "../../../utils"

const baseKey = withPrefix("recovery_flow")

export const recoveryFlowKey = (id = "no_id") => createQueryKey([baseKey, id] as const)
