import { useQuery } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { recoveryFlowKey } from "./queryKeys"
import { useRecoveryFlowContext } from "./useRecoveryFlowContext"

export function useGetRecoveryFlow() {
    const { kratosClient } = useKratosContext()
    const { recoveryFlowId } = useRecoveryFlowContext()

    return useQuery({
        queryKey: recoveryFlowKey(recoveryFlowId),
        queryFn: ({ signal }) => {
            if (!recoveryFlowId) throw new Error("No recovery flow ID provided")

            return kratosClient.getRecoveryFlow({ id: recoveryFlowId }, async ({ init: { headers } }) => ({
                signal,
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            }))
        },
        enabled: !!recoveryFlowId,
        staleTime: Infinity,
    })
}
