import { useQuery } from "@tanstack/react-query"
import { useKratosContext } from "../loginFlow"
import { loginFlowKey } from "./queryKeys"

export function useGetLoginFlow() {
    const { kratosClient, loginFlowId } = useKratosContext()

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
