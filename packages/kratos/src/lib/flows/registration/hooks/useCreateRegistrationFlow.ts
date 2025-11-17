import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { handleFlowError } from "../../../kratos"
import { registrationFlowKey } from "./queryKeys"
import { useRegistrationFlowContext } from "./useRegistrationFlowContext"

export function useCreateRegistrationFlow({ returnTo }: { returnTo?: string } = {}) {
  const { kratosClient } = useKratosClientContext()
  const { setRegistrationFlowId } = useRegistrationFlowContext()

  const client = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        return await kratosClient.createBrowserRegistrationFlow({ returnTo }, async ({ init: { headers } }) => ({
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
      client.setQueryDefaults(registrationFlowKey(data.id), { staleTime: Infinity })
      client.setQueryData(registrationFlowKey(data.id), data)
      setRegistrationFlowId(data.id)
    },
  })
}
