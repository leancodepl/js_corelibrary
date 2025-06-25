import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { loginFlowKey } from "./queryKeys"
import { useLoginFlowContext } from "./useLoginFlowContext"

export function useGetLoginFlow() {
    const { kratosClient } = useKratosClientContext()
    const { loginFlowId } = useLoginFlowContext()

    return useQuery({
        queryKey: loginFlowKey(loginFlowId),
        queryFn: context => {
            if (!loginFlowId) throw new Error("No login flow ID provided")

            return kratosClient.getLoginFlow({ id: loginFlowId }, async ({ init: { headers } }) => ({
                signal: context.signal,
                headers: { ...headers, Accept: "application/json" },
            }))
        },
        enabled: !!loginFlowId,
        staleTime: Infinity,
    })
}
