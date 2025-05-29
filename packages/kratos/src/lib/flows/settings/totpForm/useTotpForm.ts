import { useForm } from "@tanstack/react-form"
import { handleOnSubmitErrors } from "../../../utils"
import { getCsrfToken } from "../../../utils/flow"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../hooks"
import { OnSettingsFlowError } from "../types"
import { InputFields } from "./types"

type UseTotpFormProps = {
    onError?: OnSettingsFlowError
    onTotpSuccess?: () => void
}

export function useTotpForm({ onError, onTotpSuccess }: UseTotpFormProps) {
    const { mutateAsync: updateSettingsFlow } = useUpdateSettingsFlow()
    const { data: registrationFlow } = useGetSettingsFlow()

    return useForm({
        defaultValues: {
            [InputFields.Code]: "",
        },
        onSubmit: async ({ value, formApi }) => {
            if (!registrationFlow) return

            const data = await updateSettingsFlow({
                csrf_token: getCsrfToken(registrationFlow),
                method: "totp",
                totp_code: value[InputFields.Code],
            })

            if (!data) {
                return
            }

            if (data.state === "success") {
                onTotpSuccess?.()

                return
            }

            handleOnSubmitErrors(data, formApi, onError)
        },
    })
}
