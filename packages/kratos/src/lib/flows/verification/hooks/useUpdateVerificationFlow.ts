import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { handleFlowError, UpdateVerificationFlowBody, VerificationFlow, VerificationFlowState } from "../../../kratos"
import { verificationFlowKey } from "./queryKeys"
import { useVerificationFlowContext } from "./useVerificationFlowContext"

export function useUpdateVerificationFlow() {
    const { kratosClient } = useKratosContext()
    const { verificationFlowId, resetContext } = useVerificationFlowContext()
    const client = useQueryClient()

    return useMutation<VerificationFlow | undefined, Error, UpdateVerificationFlowBody, unknown>({
        mutationFn: async updateVerificationFlowBody => {
            if (!verificationFlowId) throw new Error("Verification flow ID is not set")
            try {
                const data = await kratosClient.updateVerificationFlow(
                    { flow: verificationFlowId, updateVerificationFlowBody },
                    {
                        credentials: "include",
                        headers: { Accept: "application/json", "Content-Type": "application/json" },
                    },
                )

                if (data.state === VerificationFlowState.PassedChallenge && data.return_to) {
                    window.location.href = data.return_to
                }

                return data
            } catch (error) {
                return (await handleFlowError<VerificationFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: resetContext,
                    onValidationError: body => body,
                })(error)) as VerificationFlow | undefined
            }
        },
        onSuccess(data) {
            if (data && "id" in data) {
                client.setQueryData(verificationFlowKey(data.id), data)
            }
        },
    })
}
