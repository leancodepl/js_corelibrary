import { useQuery } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { settingsFlowKey } from "./queryKeys"
import { useSettingsFlowContext } from "./useSettingsFlowContext"

export function useGetSettingsFlow() {
    const { kratosClient } = useKratosContext()
    const { settingsFlowId } = useSettingsFlowContext()

    return useQuery({
        queryKey: settingsFlowKey(settingsFlowId),
        queryFn: ({ signal }) => {
            if (!settingsFlowId) throw new Error("No settings flow ID provided")

            return kratosClient.getSettingsFlow({ id: settingsFlowId }, async ({ init: { headers } }) => ({
                signal,
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            }))
        },
        enabled: !!settingsFlowId,
        staleTime: Infinity,
    })
}
