import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { handleFlowError, RecoveryFlow, UpdateRecoveryFlowBody } from "../../../kratos"
import { recoveryFlowKey } from "./queryKeys"
import { useRecoveryFlowContext } from "./useRecoveryFlowContext"

export function useUpdateRecoveryFlow() {
  const { kratosClient } = useKratosClientContext()
  const { resetFlow, recoveryFlowId } = useRecoveryFlowContext()
  const client = useQueryClient()

  return useMutation<RecoveryFlow | undefined, Error, UpdateRecoveryFlowBody, unknown>({
    mutationFn: async updateRecoveryFlowBody => {
      if (!recoveryFlowId) throw new Error("Recovery flow ID is not set")
      try {
        const data = await kratosClient.updateRecoveryFlow(
          { flow: recoveryFlowId, updateRecoveryFlowBody },
          {
            headers: { Accept: "application/json", "Content-Type": "application/json" },
          },
        )

        return data
      } catch (error) {
        return (await handleFlowError<RecoveryFlow>({
          onRedirect: (url, _external) => {
            globalThis.location.href = url
          },
          onRestartFlow: resetFlow,
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
