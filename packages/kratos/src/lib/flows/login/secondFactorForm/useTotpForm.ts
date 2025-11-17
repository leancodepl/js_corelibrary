import { useForm } from "@tanstack/react-form"
import { instanceOfSuccessfulNativeLogin } from "../../../kratos"
import { handleOnSubmitErrors } from "../../../utils"
import { getCsrfToken } from "../../../utils/flow"
import { useGetLoginFlow, useUpdateLoginFlow } from "../hooks"
import { OnLoginFlowError } from "../types"
import { InputFields } from "./types"

type UseTotpFormProps = {
  onError?: OnLoginFlowError
  onLoginSuccess?: () => void
}

export function useTotpForm({ onError, onLoginSuccess }: UseTotpFormProps) {
  const { mutateAsync: updateLoginFlow } = useUpdateLoginFlow()
  const { data: loginFlow } = useGetLoginFlow()

  return useForm({
    defaultValues: { [InputFields.TotpCode]: "" } satisfies Record<InputFields, string>,
    onSubmit: async ({ value, formApi }) => {
      if (!loginFlow) return

      const response = await updateLoginFlow({
        csrf_token: getCsrfToken(loginFlow),
        method: "totp",
        totp_code: value.totp_code,
      })

      if (!response) {
        return
      }

      if (instanceOfSuccessfulNativeLogin(response)) {
        onLoginSuccess?.()

        return
      }

      handleOnSubmitErrors(response, formApi, onError)
    },
  })
}
