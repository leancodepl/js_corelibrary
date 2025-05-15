import { createQueryKey, withPrefix } from "../../../utils"

const baseKey = withPrefix("registration_flow")

export const registrationFlowKey = (id: string | undefined) => createQueryKey([baseKey, id ?? "no_id"] as const)
export const verificationFlowKey = (id: string | undefined) =>
    createQueryKey([baseKey, withPrefix("registration_with_verification_flow"), id ?? "no_id"] as const)
