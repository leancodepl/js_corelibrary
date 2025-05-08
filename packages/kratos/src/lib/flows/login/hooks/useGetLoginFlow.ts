import { useQuery } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { useLoginFlowContext } from "../loginFlow"
import { loginFlowKey } from "./queryKeys"

export function useGetLoginFlow() {
    const { kratosClient } = useKratosContext()
    const { loginFlowId } = useLoginFlowContext()

    return useQuery({
        queryKey: loginFlowKey(loginFlowId),
        queryFn: context => {
            if (!loginFlowId) throw new Error("No login flow ID provided")

            return kratosClient.getLoginFlow({ id: loginFlowId }, async ({ init: { headers } }) => ({
                signal: context.signal,
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            }))
        },
        enabled: !!loginFlowId,
        staleTime: Infinity,
    })
}
