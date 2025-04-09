import { useContext } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { kratosContext } from "../loginFlow"

export function useCreateLoginFlow({
    aal,
    refresh,
    returnTo,
}: { aal?: string; refresh?: boolean; returnTo?: string } = {}) {
    const { kratosClient, setLoginFlowId } = useContext(kratosContext)
    const client = useQueryClient()

    return useMutation({
        mutationFn: () =>
            kratosClient.createBrowserLoginFlow({ aal, refresh, returnTo }, async ({ init: { headers } }) => ({
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            })),
        onSuccess(data) {
            client.setQueryDefaults(["login", data.id], { staleTime: Infinity })
            client.setQueryData(["login", data.id], data)
            setLoginFlowId(data.id)
        },
    })
}
