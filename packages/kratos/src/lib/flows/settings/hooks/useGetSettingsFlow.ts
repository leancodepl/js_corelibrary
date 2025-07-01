import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { SettingsFlow } from "../../../kratos"
import { GetFlowError } from "../../../types"
import { handleFlowErrorResponse } from "../../../utils"
import { settingsFlowKey } from "./queryKeys"
import { useSettingsFlowContext } from "./useSettingsFlowContext"

export function useGetSettingsFlow() {
    const { kratosClient } = useKratosClientContext()
    const { settingsFlowId, resetFlow } = useSettingsFlowContext()

    return useQuery({
        queryKey: settingsFlowKey(settingsFlowId),
        queryFn: async ({ signal }) => {
            if (!settingsFlowId) {
                throw new Error("No settings flow ID provided", {
                    cause: GetFlowError.NoFlowId,
                })
            }

            try {
                return await kratosClient.getSettingsFlow({ id: settingsFlowId }, async ({ init: { headers } }) => ({
                    signal,
                    headers: { ...headers, Accept: "application/json" },
                }))
            } catch (error) {
                return handleFlowErrorResponse<SettingsFlow>({
                    error,
                })
            }
        },
        enabled: !!settingsFlowId,
        staleTime: Infinity,
    })
}
