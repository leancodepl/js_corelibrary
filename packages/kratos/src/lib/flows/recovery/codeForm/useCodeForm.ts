import { useForm } from "@tanstack/react-form"
import { handleOnSubmitErrors } from "../../../utils"
import { getCsrfToken } from "../../../utils/flow"
import { useGetRecoveryFlow } from "../hooks"
import { useUpdateRecoveryFlow } from "../hooks/useUpdateRecoveryFlow"
import { OnRecoveryFlowError } from "../types"
import { InputFields } from "./types"

type UseCodeFormProps = {
  onError?: OnRecoveryFlowError
}

export function useCodeForm({ onError }: UseCodeFormProps) {
  const { mutateAsync: updateRecoveryFlow } = useUpdateRecoveryFlow()
  const { data: recoveryFlow } = useGetRecoveryFlow()

  return useForm({
    defaultValues: {
      [InputFields.Code]: "",
    },
    onSubmit: async ({ value, formApi }) => {
      if (!recoveryFlow) return

      const response = await updateRecoveryFlow({
        csrf_token: getCsrfToken(recoveryFlow),
        method: "code",
        code: value[InputFields.Code],
      })

      if (!response) {
        return
      }

      handleOnSubmitErrors(response, formApi, onError)
    },
  })
}
