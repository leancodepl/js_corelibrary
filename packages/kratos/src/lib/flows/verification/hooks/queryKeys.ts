import { createQueryKey, withPrefix } from "../../../utils"

const baseKey = withPrefix("verification_flow")

export const verificationFlowKey = (id: string | undefined) => createQueryKey([baseKey, id ?? "no_id"] as const)
