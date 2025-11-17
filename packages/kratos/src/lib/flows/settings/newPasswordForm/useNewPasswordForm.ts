import { useForm } from "@tanstack/react-form"
import { handleOnSubmitErrors, TraitsConfig } from "../../../utils"
import { getCsrfToken } from "../../../utils/flow"
import { useGetSettingsFlow, useUpdateSettingsFlow } from "../hooks"
import { OnSettingsFlowError } from "../types"
import { InputFields } from "./types"

type UseNewPasswordFormProps<TTraitsConfig extends TraitsConfig> = {
  onError?: OnSettingsFlowError<TTraitsConfig>
  onChangePasswordSuccess?: () => void
}

export function useNewPasswordForm<TTraitsConfig extends TraitsConfig>({
  onError,
  onChangePasswordSuccess,
}: UseNewPasswordFormProps<TTraitsConfig>) {
  const { mutateAsync: updateSettingsFlow } = useUpdateSettingsFlow()
  const { data: settingsFlow } = useGetSettingsFlow()

  return useForm({
    defaultValues: {
      [InputFields.Password]: "",
      [InputFields.PasswordConfirmation]: "",
    },
    onSubmit: async ({ value, formApi }) => {
      if (!settingsFlow) return

      const data = await updateSettingsFlow({
        csrf_token: getCsrfToken(settingsFlow),
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
