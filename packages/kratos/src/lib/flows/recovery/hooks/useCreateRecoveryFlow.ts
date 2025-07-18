import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { recoveryFlowKey } from "./queryKeys"
import { useRecoveryFlowContext } from "./useRecoveryFlowContext"

export function useCreateRecoveryFlow({ returnTo }: { returnTo?: string } = {}) {
    const { kratosClient } = useKratosClientContext()
    const { setRecoveryFlowId } = useRecoveryFlowContext()

    const client = useQueryClient()

    return useMutation({
        mutationFn: () =>
            kratosClient.createBrowserRecoveryFlow({ returnTo }, async ({ init: { headers } }) => ({
                headers: { ...headers, Accept: "application/json" },
            })),
        onSuccess(data) {
            client.setQueryDefaults(recoveryFlowKey(data.id), { staleTime: Infinity })
            client.setQueryData(recoveryFlowKey(data.id), data)
            setRecoveryFlowId(data.id)
        },
    })
}
