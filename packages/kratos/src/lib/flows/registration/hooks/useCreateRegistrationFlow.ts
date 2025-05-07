import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../login"
import { registrationFlowKey } from "./queryKeys"

export function useCreateRegistrationFlow({ returnTo }: { returnTo?: string } = {}) {
    const { kratosClient, setRegistrationFlowId } = useKratosContext()
    const client = useQueryClient()

    return useMutation({
        mutationFn: () =>
            kratosClient.createBrowserRegistrationFlow({ returnTo }, async ({ init: { headers } }) => ({
                headers: { ...headers, Accept: "application/json" },
                credentials: "include",
            })),
        onSuccess(data) {
            client.setQueryDefaults(registrationFlowKey(data.id), { staleTime: Infinity })
            client.setQueryData(registrationFlowKey(data.id), data)
            setRegistrationFlowId(data.id)
        },
    })
}
