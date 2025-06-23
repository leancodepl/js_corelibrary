import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { handleFlowError, SettingsFlow } from "../../../kratos"
import { settingsFlowKey } from "./queryKeys"
import { useSettingsFlowContext } from "./useSettingsFlowContext"

export function useGetSettingsFlow() {
    const { kratosClient } = useKratosClientContext()
    const { settingsFlowId, resetFlow } = useSettingsFlowContext()

    return useQuery({
        queryKey: settingsFlowKey(settingsFlowId),
        queryFn: async ({ signal }) => {
            if (!settingsFlowId) throw new Error("No settings flow ID provided")

            try {
                return await kratosClient.getSettingsFlow({ id: settingsFlowId }, async ({ init: { headers } }) => ({
                    signal,
                    headers: { ...headers, Accept: "application/json" },
                }))
            } catch (error) {
                return (await handleFlowError<SettingsFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: resetFlow,
                    onValidationError: body => body,
                })(error)) as SettingsFlow | undefined
            }
        },
        enabled: !!settingsFlowId,
        staleTime: Infinity,
    })
}
