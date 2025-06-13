import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useKratosContext } from "../../../hooks"
import { handleFlowError, SettingsFlow, UpdateSettingsFlowBody } from "../../../kratos"
import { settingsFlowKey } from "./queryKeys"
import { useSettingsFlowContext } from "./useSettingsFlowContext"

export function useUpdateSettingsFlow() {
    const { kratosClient } = useKratosContext()
    const { settingsFlowId, resetContext, setEmailVerificationRequired } = useSettingsFlowContext()
    const client = useQueryClient()

    return useMutation<SettingsFlow | undefined, Error, UpdateSettingsFlowBody, unknown>({
        mutationFn: async updateSettingsFlowBody => {
            if (!settingsFlowId) throw new Error("Settings flow ID is not set")
            try {
                const data = await kratosClient.updateSettingsFlow(
                    { flow: settingsFlowId, updateSettingsFlowBody },
                    {
                        credentials: "include",
                        headers: { Accept: "application/json", "Content-Type": "application/json" },
                    },
                )

                if (data && "continue_with" in data) {
                    const showVerificationUI = data.continue_with?.find(e => e.action === "show_verification_ui")

                    if (showVerificationUI) {
                        setEmailVerificationRequired(true)
                    }
                }

                return data
            } catch (error) {
                return (await handleFlowError<SettingsFlow>({
                    onRedirect: (url, _external) => {
                        window.location.href = url
                    },
                    onRestartFlow: resetContext,
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
