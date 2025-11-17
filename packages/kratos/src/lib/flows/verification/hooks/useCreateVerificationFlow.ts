import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { verificationFlowKey } from "./queryKeys"
import { useVerificationFlowContext } from "./useVerificationFlowContext"

export function useCreateVerificationFlow({ returnTo }: { returnTo?: string } = {}) {
  const { kratosClient } = useKratosClientContext()
  const { setVerificationFlowId } = useVerificationFlowContext()

  const client = useQueryClient()

  return useMutation({
    mutationFn: () =>
      kratosClient.createBrowserVerificationFlow({ returnTo }, async ({ init: { headers } }) => ({
        headers: { ...headers, Accept: "application/json" },
      })),
    onSuccess(data) {
      client.setQueryDefaults(verificationFlowKey(data.id), { staleTime: Infinity })
      client.setQueryData(verificationFlowKey(data.id), data)
      setVerificationFlowId(data.id)
    },
  })
}
