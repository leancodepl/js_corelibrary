import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { LoginFlow, SuccessfulNativeLogin, UpdateLoginFlowBody } from "../../../kratos"
import { handleContinueWith, handleFlowError } from "../../../kratos/contrib"
import { useLoginFlowContext } from "../loginFlow"
import { loginFlowKey } from "./queryKeys"

export function useUpdateLoginFlow() {
    const { kratosClient } = useKratosContext()
    const { setLoginFlowId, loginFlowId } = useLoginFlowContext()

    const client = useQueryClient()

    return useMutation<LoginFlow | SuccessfulNativeLogin | undefined, Error, UpdateLoginFlowBody, unknown>({
        mutationFn: async updateLoginFlowBody => {
            if (!loginFlowId) throw new Error("Login flow ID is not set")
            try {
                const response = await kratosClient.updateLoginFlowRaw(
                    { flow: loginFlowId, updateLoginFlowBody },
                    { credentials: "include" },
                )

                const data = await response.value()

                if (data && "continue_with" in data) {
                    handleContinueWith(data.continue_with, {
                        onRedirect: (url, _external) => {
                            window.location.href = url
                        },
                    })
                }

                return data
            } catch (error) {
                return (await handleFlowError<LoginFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: () => setLoginFlowId(undefined),
                    onValidationError: body => body,
                })(error)) as LoginFlow | undefined
            }
        },
        onSuccess(data) {
            if (data && "id" in data) {
                client.setQueryData(loginFlowKey(data.id), data)
            }
        },
    })
}
