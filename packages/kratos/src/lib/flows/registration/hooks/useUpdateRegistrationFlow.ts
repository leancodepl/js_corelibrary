import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    handleContinueWith,
    handleFlowError,
    RegistrationFlow,
    SuccessfulNativeRegistration,
    UpdateRegistrationFlowBody,
} from "../../../kratos"
import { useKratosContext } from "../../login"
import { registrationFlowKey } from "./queryKeys"

export function useUpdateRegistrationFlow() {
    const { kratosClient, setRegistrationFlowId, registrationFlowId } = useKratosContext()
    const client = useQueryClient()

    return useMutation<
        RegistrationFlow | SuccessfulNativeRegistration | undefined,
        Error,
        UpdateRegistrationFlowBody,
        unknown
    >({
        mutationFn: async updateRegistrationFlowBody => {
            if (!registrationFlowId) throw new Error("Registration flow ID is not set")
            try {
                const response = await kratosClient.updateRegistrationFlowRaw(
                    { flow: registrationFlowId, updateRegistrationFlowBody },
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
                return (await handleFlowError<RegistrationFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: () => setRegistrationFlowId(undefined),
                    onValidationError: body => body,
                })(error)) as RegistrationFlow | undefined
            }
        },
        onSuccess(data) {
            if (data && "id" in data) {
                client.setQueryData(registrationFlowKey(data.id), data)
            }
        },
    })
}
