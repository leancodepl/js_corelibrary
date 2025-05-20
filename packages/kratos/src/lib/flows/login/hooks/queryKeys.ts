import { createQueryKey, withPrefix } from "../../../utils"

const baseKey = withPrefix("login_flow")

export const loginFlowKey = (id: string | undefined) => createQueryKey([baseKey, id ?? "no_id"] as const)
