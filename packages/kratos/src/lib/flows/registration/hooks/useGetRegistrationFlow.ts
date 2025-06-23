import { useQuery } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { handleFlowError, RegistrationFlow } from "../../../kratos"
import { registrationFlowKey } from "./queryKeys"
import { useRegistrationFlowContext } from "./useRegistrationFlowContext"

export function useGetRegistrationFlow() {
    const { kratosClient } = useKratosClientContext()
    const { registrationFlowId, resetFlow } = useRegistrationFlowContext()

    return useQuery({
        queryKey: registrationFlowKey(registrationFlowId),
        queryFn: async ({ signal }) => {
            if (!registrationFlowId) throw new Error("No registration flow ID provided")

            try {
                return await kratosClient.getRegistrationFlow(
                    { id: registrationFlowId },
                    async ({ init: { headers } }) => ({
                        signal,
                        headers: { ...headers, Accept: "application/json" },
                    }),
                )
            } catch (error) {
                return (await handleFlowError<RegistrationFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: resetFlow,
                    onValidationError: body => body,
                })(error)) as RegistrationFlow | undefined
            }
        },
        enabled: !!registrationFlowId,
        staleTime: Infinity,
    })
}
