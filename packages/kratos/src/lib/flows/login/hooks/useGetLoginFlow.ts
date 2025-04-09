import { useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { kratosContext } from "../loginFlow"

export function useGetLoginFlow() {
    const { kratosClient, loginFlowId } = useContext(kratosContext)

    return useQuery({
        queryKey: ["login", loginFlowId],
        queryFn: context =>
            kratosClient.getLoginFlow({ id: context.queryKey[1]! }, async ({ init: { headers } }) => ({
                signal: context.signal,
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            })),
        enabled: !!loginFlowId,
        staleTime: Infinity,
    })
}
