import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { registrationFlowKey } from "./queryKeys"
import { useRegistrationFlowContext } from "./useRegistrationFlowContext"

export function useCreateRegistrationFlow({ returnTo }: { returnTo?: string } = {}) {
    const { kratosClient } = useKratosContext()
    const { setRegistrationFlowId } = useRegistrationFlowContext()

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
