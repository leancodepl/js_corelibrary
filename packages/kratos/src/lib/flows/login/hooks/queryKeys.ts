import { createQueryKey, withPrefix } from "../../../utils"

const baseKey = withPrefix("login_flow")

export const loginFlowKey = (id = "no_id") => createQueryKey([baseKey, id] as const)
