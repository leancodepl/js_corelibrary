import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { recoveryFlowKey } from "./queryKeys"
import { useRecoveryFlowContext } from "./useRecoveryFlowContext"

export function useGetRecoveryFlow() {
    const { kratosClient } = useKratosClientContext()
    const { recoveryFlowId } = useRecoveryFlowContext()

    return useQuery({
        queryKey: recoveryFlowKey(recoveryFlowId),
        queryFn: ({ signal }) => {
            if (!recoveryFlowId) throw new Error("No recovery flow ID provided")

            return kratosClient.getRecoveryFlow({ id: recoveryFlowId }, async ({ init: { headers } }) => ({
                signal,
                headers: { ...headers, Accept: "application/json" },
            }))
        },
        enabled: !!recoveryFlowId,
        staleTime: Infinity,
    })
}
