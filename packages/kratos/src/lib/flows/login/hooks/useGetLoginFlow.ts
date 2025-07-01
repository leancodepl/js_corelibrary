import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { LoginFlow } from "../../../kratos"
import { GetFlowError } from "../../../types"
import { handleFlowErrorResponse } from "../../../utils"
import { loginFlowKey } from "./queryKeys"
import { useLoginFlowContext } from "./useLoginFlowContext"

export function useGetLoginFlow() {
    const { kratosClient } = useKratosClientContext()
    const { loginFlowId, resetFlow } = useLoginFlowContext()

    return useQuery({
        queryKey: loginFlowKey(loginFlowId),
        queryFn: async ({ signal }) => {
            if (!loginFlowId) {
                throw new Error("No login flow ID provided", {
                    cause: GetFlowError.NoFlowId,
                })
            }

            try {
                return await kratosClient.getLoginFlow({ id: loginFlowId }, async ({ init: { headers } }) => ({
                    signal,
                    headers: { ...headers, Accept: "application/json" },
                }))
            } catch (error) {
                return handleFlowErrorResponse<LoginFlow>({
                    error,
                })
            }
        },
        enabled: !!loginFlowId,
        staleTime: Infinity,
    })
}
