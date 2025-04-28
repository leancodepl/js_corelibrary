const baseKey = "login" as const

export const loginFlowKey = (id: string | undefined) => {
    if (!id) {
        return [baseKey] as const
    }

    return [baseKey, id] as const
}
