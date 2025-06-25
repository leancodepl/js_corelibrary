import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { verificationFlowKey } from "./queryKeys"
import { useVerificationFlowContext } from "./useVerificationFlowContext"

export function useGetVerificationFlow() {
    const { kratosClient } = useKratosClientContext()
    const { verificationFlowId } = useVerificationFlowContext()

    return useQuery({
        queryKey: verificationFlowKey(verificationFlowId),
        queryFn: ({ signal }) => {
            if (!verificationFlowId) throw new Error("No verification flow ID provided")

            return kratosClient.getVerificationFlow({ id: verificationFlowId }, async ({ init: { headers } }) => ({
                signal,
                headers: { ...headers, Accept: "application/json" },
            }))
        },
        enabled: !!verificationFlowId,
        staleTime: Infinity,
    })
}
