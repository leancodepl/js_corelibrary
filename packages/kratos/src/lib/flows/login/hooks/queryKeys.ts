import { createQueryKey, withQueryKeyPrefix } from "../../../utils"

const baseKey = withQueryKeyPrefix("login_flow")

export const loginFlowKey = (id = "no_id") => createQueryKey([baseKey, id] as const)
