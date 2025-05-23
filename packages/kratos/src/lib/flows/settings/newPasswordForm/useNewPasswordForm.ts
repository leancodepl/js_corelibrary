import { useForm } from "@tanstack/react-form"
import { handleOnSubmitErrors } from "../../../utils"
import { getCsrfToken } from "../../../utils/flow"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../hooks"
import { OnSettingsFlowError } from "../types"
import { InputFields } from "./types"

type UseNewPasswordFormProps = {
    onError?: OnSettingsFlowError
    onChangePasswordSuccess?: () => void
}

export function useNewPasswordForm({ onError, onChangePasswordSuccess }: UseNewPasswordFormProps) {
    const { mutateAsync: updateSettingsFlow } = useUpdateSettingsFlow()
    const { data: registrationFlow } = useGetSettingsFlow()

    return useForm({
        defaultValues: {
            [InputFields.Password]: "",
            [InputFields.PasswordConfirmation]: "",
        },
        onSubmit: async ({ value, formApi }) => {
            if (!registrationFlow) return

            const data = await updateSettingsFlow({
                csrf_token: getCsrfToken(registrationFlow),
                method: "password",
                password: value[InputFields.Password],
            })

            if (!data) {
                return
            }

            if (data.state === "success") {
                onChangePasswordSuccess?.()

                return
            }

            handleOnSubmitErrors(data, formApi, onError)
        },
    })
}
