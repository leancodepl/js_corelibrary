const baseKey = "leancode_kratos_login_flow"

export const loginFlowKey = (id: string | undefined) => {
    if (!id) {
        return [baseKey] as const
    }

    return [baseKey, id] as const
}
