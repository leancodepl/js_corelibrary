import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { VerificationFlow } from "../../../kratos"
import { GetFlowError } from "../../../types"
import { handleFlowErrorResponse } from "../../../utils"
import { verificationFlowKey } from "./queryKeys"
import { useVerificationFlowContext } from "./useVerificationFlowContext"

export function useGetVerificationFlow() {
    const { kratosClient } = useKratosClientContext()
    const { verificationFlowId, resetFlow } = useVerificationFlowContext()

    return useQuery({
        queryKey: verificationFlowKey(verificationFlowId),
        queryFn: async ({ signal }) => {
            if (!verificationFlowId) {
                throw new Error("No verification flow ID provided", {
                    cause: GetFlowError.NoFlowId,
                })
            }

            try {
                return await kratosClient.getVerificationFlow(
                    { id: verificationFlowId },
                    async ({ init: { headers } }) => ({
                        signal,
                        headers: { ...headers, Accept: "application/json" },
                    }),
                )
            } catch (error) {
                throw await handleFlowErrorResponse<VerificationFlow>({
                    error,
                })
            }
        },
        enabled: !!verificationFlowId,
        staleTime: Infinity,
    })
}
