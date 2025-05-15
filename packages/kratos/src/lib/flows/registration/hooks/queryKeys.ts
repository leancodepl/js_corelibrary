const baseKey = "leancode_kratos_registration_flow"

export const registrationFlowKey = (id: string | undefined) => {
    if (!id) {
        return [baseKey] as const
    }

    return [baseKey, id] as const
}

export const verificationFlowKey = (id: string | undefined) => {
    if (!id) {
        return [baseKey] as const
    }

    return [baseKey, "register_with_verification_flow", id] as const
}
