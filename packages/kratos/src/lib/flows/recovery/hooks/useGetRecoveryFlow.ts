import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { handleFlowError, RecoveryFlow } from "../../../kratos"
import { recoveryFlowKey } from "./queryKeys"
import { useRecoveryFlowContext } from "./useRecoveryFlowContext"

export function useGetRecoveryFlow() {
    const { kratosClient } = useKratosClientContext()
    const { recoveryFlowId, resetFlow } = useRecoveryFlowContext()

    return useQuery({
        queryKey: recoveryFlowKey(recoveryFlowId),
        queryFn: async ({ signal }) => {
            if (!recoveryFlowId) throw new Error("No recovery flow ID provided")

            try {
                return await kratosClient.getRecoveryFlow({ id: recoveryFlowId }, async ({ init: { headers } }) => ({
                    signal,
                    headers: { ...headers, Accept: "application/json" },
                }))
            } catch (error) {
                return (await handleFlowError<RecoveryFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: resetFlow,
                    onValidationError: body => body,
                })(error)) as RecoveryFlow | undefined
            }
        },
        enabled: !!recoveryFlowId,
        staleTime: Infinity,
    })
}
