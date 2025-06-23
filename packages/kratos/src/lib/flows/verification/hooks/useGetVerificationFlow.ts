import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { handleFlowError, VerificationFlow } from "../../../kratos"
import { verificationFlowKey } from "./queryKeys"
import { useVerificationFlowContext } from "./useVerificationFlowContext"

export function useGetVerificationFlow() {
    const { kratosClient } = useKratosClientContext()
    const { verificationFlowId, resetFlow } = useVerificationFlowContext()

    return useQuery({
        queryKey: verificationFlowKey(verificationFlowId),
        queryFn: async ({ signal }) => {
            if (!verificationFlowId) throw new Error("No verification flow ID provided")

            try {
                return await kratosClient.getVerificationFlow(
                    { id: verificationFlowId },
                    async ({ init: { headers } }) => ({
                        signal,
                        headers: { ...headers, Accept: "application/json" },
                    }),
                )
            } catch (error) {
                return (await handleFlowError<VerificationFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: resetFlow,
                    onValidationError: body => body,
                })(error)) as VerificationFlow | undefined
            }
        },
        enabled: !!verificationFlowId,
        staleTime: Infinity,
    })
}
