import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { settingsFlowKey } from "./queryKeys"
import { useSettingsFlowContext } from "./useSettingsFlowContext"

export function useGetSettingsFlow() {
    const { kratosClient } = useKratosClientContext()
    const { settingsFlowId } = useSettingsFlowContext()

    return useQuery({
        queryKey: settingsFlowKey(settingsFlowId),
        queryFn: ({ signal }) => {
            if (!settingsFlowId) throw new Error("No settings flow ID provided")

            return kratosClient.getSettingsFlow({ id: settingsFlowId }, async ({ init: { headers } }) => ({
                signal,
                headers: { ...headers, Accept: "application/json" },
            }))
        },
        enabled: !!settingsFlowId,
        staleTime: Infinity,
    })
}
