import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { RegistrationFlow } from "../../../kratos"
import { GetFlowError } from "../../../types"
import { handleFlowErrorResponse } from "../../../utils"
import { registrationFlowKey } from "./queryKeys"
import { useRegistrationFlowContext } from "./useRegistrationFlowContext"

export function useGetRegistrationFlow() {
  const { kratosClient } = useKratosClientContext()
  const { registrationFlowId } = useRegistrationFlowContext()

  return useQuery({
    queryKey: registrationFlowKey(registrationFlowId),
    queryFn: async ({ signal }) => {
      if (!registrationFlowId) {
        throw new Error("No registration flow ID provided", {
          cause: GetFlowError.NoFlowId,
        })
      }

      try {
        return await kratosClient.getRegistrationFlow({ id: registrationFlowId }, async ({ init: { headers } }) => ({
          signal,
          headers: { ...headers, Accept: "application/json" },
        }))
      } catch (error) {
        throw await handleFlowErrorResponse<RegistrationFlow>({
          error,
        })
      }
    },
    enabled: !!registrationFlowId,
    staleTime: Infinity,
  })
}
