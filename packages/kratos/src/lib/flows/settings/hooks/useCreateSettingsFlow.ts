import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { settingsFlowKey } from "./queryKeys"
import { useSettingsFlowContext } from "./useSettingsFlowContext"

export function useCreateSettingsFlow() {
  const { kratosClient } = useKratosClientContext()
  const { setSettingsFlowId } = useSettingsFlowContext()

  const client = useQueryClient()

  return useMutation({
    mutationFn: () =>
      kratosClient.createBrowserSettingsFlow({}, async ({ init: { headers } }) => ({
        headers: { ...headers, Accept: "application/json" },
      })),
    onSuccess(data) {
      client.setQueryDefaults(settingsFlowKey(data.id), { staleTime: Infinity })
      client.setQueryData(settingsFlowKey(data.id), data)
      setSettingsFlowId(data.id)
    },
  })
}
