import { useForm } from "@tanstack/react-form"
import { useLoginFlowContext } from ".."
import { VerificationFlowState } from "../../../kratos"
import { getCsrfToken, handleOnSubmitErrors } from "../../../utils"
import { useGetVerificationFlow } from "../hooks"
import { useUpdateVerificationFlow } from "../hooks/useUpdateVerificationFlow"
import { OnLoginFlowError } from "../types"
import { InputFields } from "./types"

type UseEmailVerificationFormProps = {
    onError?: OnLoginFlowError
    onVerificationSuccess?: () => void
}

export function useEmailVerificationForm({ onError, onVerificationSuccess }: UseEmailVerificationFormProps) {
    const { verifableAddress } = useLoginFlowContext()
    const { mutateAsync: updateVerificationFlow } = useUpdateVerificationFlow()
    const { data: verificationFlow } = useGetVerificationFlow()

    return useForm({
        defaultValues: { [InputFields.Code]: "" } satisfies Record<InputFields, string>,
        onSubmit: async ({ value, formApi }) => {
            if (!verificationFlow || !verifableAddress) return

            const response = await updateVerificationFlow({
                csrf_token: getCsrfToken(verificationFlow),
                method: "code",
                code: value.code,
                email: verifableAddress,
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
