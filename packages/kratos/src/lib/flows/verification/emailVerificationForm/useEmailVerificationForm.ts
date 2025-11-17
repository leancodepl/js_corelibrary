import { useForm } from "@tanstack/react-form"
import { VerificationFlowState } from "../../../kratos"
import { getCsrfToken, handleOnSubmitErrors } from "../../../utils"
import { useGetVerificationFlow, useUpdateVerificationFlow, useVerificationFlowContext } from "../hooks"
import { OnVerificationFlowError } from "../types"
import { InputFields } from "./types"

type UseEmailVerificationFormProps = {
  onError?: OnVerificationFlowError
  onVerificationSuccess?: () => void
}

export function useEmailVerificationForm({ onError, onVerificationSuccess }: UseEmailVerificationFormProps) {
  const { verifiableAddress: email } = useVerificationFlowContext()
  const { mutateAsync: updateVerificationFlow } = useUpdateVerificationFlow()
  const { data: verificationFlow } = useGetVerificationFlow()

  return useForm({
    defaultValues: { [InputFields.Code]: "" } satisfies Record<InputFields, string>,
    onSubmit: async ({ value, formApi }) => {
      if (!verificationFlow || !email) return

      const response = await updateVerificationFlow({
        csrf_token: getCsrfToken(verificationFlow),
        method: "code",
        code: value.code,
        email,
      })

      if (!response) {
        return
      }

      if (response.state == VerificationFlowState.PassedChallenge) {
        onVerificationSuccess?.()

        return
      }

      handleOnSubmitErrors(response, formApi, onError)
    },
  })
}
