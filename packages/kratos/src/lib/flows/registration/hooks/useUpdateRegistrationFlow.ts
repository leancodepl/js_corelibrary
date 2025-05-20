import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import {
    handleContinueWith,
    handleFlowError,
    RegistrationFlow,
    SuccessfulNativeRegistration,
    UpdateRegistrationFlowBody,
} from "../../../kratos"
import { useVerificationFlowContext } from "../../verification"
import { registrationFlowKey } from "./queryKeys"
import { useRegistrationFlowContext } from "./useRegistrationFlowContext"

export function useUpdateRegistrationFlow() {
    const { kratosClient } = useKratosContext()
    const { resetContext, registrationFlowId } = useRegistrationFlowContext()
    const { setVerificationFlowId, setVerifiableAddress } = useVerificationFlowContext()
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
                    {
                        credentials: "include",
                        headers: { Accept: "application/json", "Content-Type": "application/json" },
                    },
                )

                const data = await response.value()

                if (data && "continue_with" in data) {
                    const showVerificationUI = data.continue_with?.find(e => e.action === "show_verification_ui")

                    if (showVerificationUI !== undefined) {
                        setVerificationFlowId(showVerificationUI.flow.id)
                        setVerifiableAddress(showVerificationUI.flow.verifiable_address)
                    } else {
                        handleContinueWith(data.continue_with, {
                            onRedirect: (url, _external) => {
                                window.location.href = url
                            },
                        })
                    }
                }

                return data
            } catch (error) {
                return (await handleFlowError<RegistrationFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: resetContext,
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
