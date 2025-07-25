import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosClientContext } from "../../../hooks"
import { handleContinueWith, handleFlowError, SettingsFlow, UpdateSettingsFlowBody } from "../../../kratos"
import { settingsFlowKey } from "./queryKeys"
import { useSettingsFlowContext } from "./useSettingsFlowContext"

export function useUpdateSettingsFlow() {
    const { kratosClient } = useKratosClientContext()
    const { settingsFlowId, resetFlow, setEmailVerificationRequired } = useSettingsFlowContext()
    const client = useQueryClient()

    return useMutation<SettingsFlow | undefined, Error, UpdateSettingsFlowBody, unknown>({
        mutationFn: async updateSettingsFlowBody => {
            if (!settingsFlowId) throw new Error("Settings flow ID is not set")
            try {
                const data = await kratosClient.updateSettingsFlow(
                    { flow: settingsFlowId, updateSettingsFlowBody },
                    {
                        headers: { Accept: "application/json", "Content-Type": "application/json" },
                    },
                )

                if (data && "continue_with" in data) {
                    const showVerificationUI = data.continue_with?.find(e => e.action === "show_verification_ui")

                    if (showVerificationUI) {
                        setEmailVerificationRequired(true)
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
                // 403 Forbidden if privileged_session_max_age exceeded
                return (await handleFlowError<SettingsFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: resetFlow,
                    onValidationError: body => body,
                })(error)) as SettingsFlow | undefined
            }
        },
        onSuccess(data) {
            if (data && "id" in data) {
                client.setQueryData(settingsFlowKey(data.id), data)
            }
        },
    })
}
