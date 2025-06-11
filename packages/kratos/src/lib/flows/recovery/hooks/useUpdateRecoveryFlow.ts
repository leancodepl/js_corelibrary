import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { handleFlowError, RecoveryFlow, UpdateRecoveryFlowBody } from "../../../kratos"
import { recoveryFlowKey } from "./queryKeys"
import { useRecoveryFlowContext } from "./useRecoveryFlowContext"

export function useUpdateRecoveryFlow() {
    const { kratosClient } = useKratosContext()
    const { resetContext, recoveryFlowId } = useRecoveryFlowContext()
    const client = useQueryClient()

    return useMutation<RecoveryFlow | undefined, Error, UpdateRecoveryFlowBody, unknown>({
        mutationFn: async updateRecoveryFlowBody => {
            if (!recoveryFlowId) throw new Error("Recovery flow ID is not set")
            try {
                const data = await kratosClient.updateRecoveryFlow(
                    { flow: recoveryFlowId, updateRecoveryFlowBody },
                    {
                        credentials: "include",
                        headers: { Accept: "application/json", "Content-Type": "application/json" },
                    },
                )

                return data
            } catch (error) {
                return (await handleFlowError<RecoveryFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: resetContext,
                    onValidationError: body => body,
                })(error)) as RecoveryFlow | undefined
            }
        },
        onSuccess(data) {
            if (data && "id" in data) {
                client.setQueryData(recoveryFlowKey(data.id), data)
            }
        },
    })
}
