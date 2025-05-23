import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { recoveryFlowKey } from "./queryKeys"
import { useRecoveryFlowContext } from "./useRecoveryFlowContext"

export function useCreateRecoveryFlow({ returnTo }: { returnTo?: string } = {}) {
    const { kratosClient } = useKratosContext()
    const { setRecoveryFlowId } = useRecoveryFlowContext()

    const client = useQueryClient()

    return useMutation({
        mutationFn: () =>
            kratosClient.createBrowserRecoveryFlow({ returnTo }, async ({ init: { headers } }) => ({
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            })),
        onSuccess(data) {
            client.setQueryDefaults(recoveryFlowKey(data.id), { staleTime: Infinity })
            client.setQueryData(recoveryFlowKey(data.id), data)
            setRecoveryFlowId(data.id)
        },
    })
}
