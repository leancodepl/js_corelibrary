import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { settingsFlowKey } from "./queryKeys"
import { useSettingsFlowContext } from "./useSettingsFlowContext"

export function useCreateSettingsFlow({ returnTo }: { returnTo?: string } = {}) {
    const { kratosClient } = useKratosContext()
    const { setSettingsFlowId } = useSettingsFlowContext()

    const client = useQueryClient()

    return useMutation({
        mutationFn: () =>
            kratosClient.createBrowserSettingsFlow({ returnTo }, async ({ init: { headers } }) => ({
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            })),
        onSuccess(data) {
            client.setQueryDefaults(settingsFlowKey(data.id), { staleTime: Infinity })
            client.setQueryData(settingsFlowKey(data.id), data)
            setSettingsFlowId(data.id)
        },
    })
}
