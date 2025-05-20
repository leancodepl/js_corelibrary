import { createQueryKey, withPrefix } from "../../../utils"

const baseKey = withPrefix("registration_flow")

export const registrationFlowKey = (id: string | undefined) => createQueryKey([baseKey, id ?? "no_id"] as const)
