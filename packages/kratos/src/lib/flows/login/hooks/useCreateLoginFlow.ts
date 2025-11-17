import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { handleFlowError } from "../../../kratos"
import { loginFlowKey } from "./queryKeys"
import { useLoginFlowContext } from "./useLoginFlowContext"

export function useCreateLoginFlow({
  aal,
  refresh,
  returnTo,
}: { aal?: string; refresh?: boolean; returnTo?: string } = {}) {
  const { kratosClient } = useKratosClientContext()
  const { setLoginFlowId } = useLoginFlowContext()

  const client = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        return await kratosClient.createBrowserLoginFlow({ aal, refresh, returnTo }, async ({ init: { headers } }) => ({
          headers: { ...headers, Accept: "application/json" },
        }))
      } catch (error) {
        throw await handleFlowError({
          onRestartFlow: () => {},
          onRedirect: () => {},
          onValidationError: body => body,
        })(error)
      }
    },
    onSuccess(data) {
      client.setQueryDefaults(loginFlowKey(data.id), { staleTime: Infinity })
      client.setQueryData(loginFlowKey(data.id), data)
      setLoginFlowId(data.id)
    },
  })
}
