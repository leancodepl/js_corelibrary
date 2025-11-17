import { useForm } from "@tanstack/react-form"
import { handleOnSubmitErrors } from "../../../utils"
import { getCsrfToken } from "../../../utils/flow"
import { useGetRecoveryFlow } from "../hooks"
import { useUpdateRecoveryFlow } from "../hooks/useUpdateRecoveryFlow"
import { OnRecoveryFlowError } from "../types"
import { InputFields } from "./types"

type UseEmailFormProps = {
  onError?: OnRecoveryFlowError
}

export function useEmailForm({ onError }: UseEmailFormProps) {
  const { mutateAsync: updateRecoveryFlow } = useUpdateRecoveryFlow()
  const { data: recoveryFlow } = useGetRecoveryFlow()

  return useForm({
    defaultValues: {
      [InputFields.Email]: "",
    },
    onSubmit: async ({ value, formApi }) => {
      if (!recoveryFlow) return

      const response = await updateRecoveryFlow({
        csrf_token: getCsrfToken(recoveryFlow),
        method: "code",
        email: value[InputFields.Email],
      })

      if (!response) {
        return
      }

      handleOnSubmitErrors(response, formApi, onError)
    },
  })
}
