import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { handleFlowError, LoginFlow } from "../../../kratos"
import { loginFlowKey } from "./queryKeys"
import { useLoginFlowContext } from "./useLoginFlowContext"

export function useGetLoginFlow() {
    const { kratosClient } = useKratosClientContext()
    const { loginFlowId, resetFlow } = useLoginFlowContext()

    return useQuery({
        queryKey: loginFlowKey(loginFlowId),
        queryFn: async ({ signal }) => {
            if (!loginFlowId) throw new Error("No login flow ID provided")

            try {
                return await kratosClient.getLoginFlow({ id: loginFlowId }, async ({ init: { headers } }) => ({
                    signal,
                    headers: { ...headers, Accept: "application/json" },
                }))
            } catch (error) {
                return (await handleFlowError<LoginFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: resetFlow,
                    onValidationError: body => body,
                })(error)) as LoginFlow | undefined
            }
        },
        enabled: !!loginFlowId,
        staleTime: Infinity,
    })
}
