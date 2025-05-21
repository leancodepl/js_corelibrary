import { createQueryKey, withQueryKeyPrefix } from "../../../utils"

const baseKey = withQueryKeyPrefix("registration_flow")

export const registrationFlowKey = (id = "no_id") => createQueryKey([baseKey, id] as const)
