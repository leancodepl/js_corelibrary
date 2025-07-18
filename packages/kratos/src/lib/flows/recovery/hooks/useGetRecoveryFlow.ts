import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { RecoveryFlow } from "../../../kratos"
import { GetFlowError } from "../../../types"
import { handleFlowErrorResponse } from "../../../utils"
import { recoveryFlowKey } from "./queryKeys"
import { useRecoveryFlowContext } from "./useRecoveryFlowContext"

export function useGetRecoveryFlow() {
    const { kratosClient } = useKratosClientContext()
    const { recoveryFlowId } = useRecoveryFlowContext()

    return useQuery({
        queryKey: recoveryFlowKey(recoveryFlowId),
        queryFn: async ({ signal }) => {
            if (!recoveryFlowId) {
                throw new Error("No recovery flow ID provided", {
                    cause: GetFlowError.NoFlowId,
                })
            }

            try {
                return await kratosClient.getRecoveryFlow({ id: recoveryFlowId }, async ({ init: { headers } }) => ({
                    signal,
                    headers: { ...headers, Accept: "application/json" },
                }))
            } catch (error) {
                throw await handleFlowErrorResponse<RecoveryFlow>({
                    error,
                })
            }
        },
        enabled: !!recoveryFlowId,
        staleTime: Infinity,
    })
}
