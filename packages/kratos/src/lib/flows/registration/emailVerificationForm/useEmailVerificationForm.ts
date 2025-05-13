import { useForm } from "@tanstack/react-form"
import { VerificationFlowState } from "../../../kratos"
import { getAuthErrorsFromUiTextList, getCsrfToken, getNodeById, inputNodeMessages } from "../../../utils"
import { useGetVerificationFlow } from "../hooks"
import { useUpdateVerificationFlow } from "../hooks/useUpdateVerificationFlow"
import { useRegistrationFlowContext } from "../registrationFlow"
import { OnRegistrationFlowError } from "../types"
import { InputFields } from "./types"

type UseEmailVerificationFormProps = {
    onError?: OnRegistrationFlowError
    onVerificationSuccess?: () => void
}

export function useEmailVerificationForm({ onError, onVerificationSuccess }: UseEmailVerificationFormProps) {
    const { verifableAddress: email } = useRegistrationFlowContext()
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

            // TODO - needs to be extracted later to a function to avoid code duplication with other forms from all flows
            const errors = getAuthErrorsFromUiTextList(response.ui.messages)

            if (errors.length > 0) {
                formApi.setErrorMap({
                    // TODO - this is a workaround for the type error in TanStack Form - remove when fixed
                    // TanStack Form has a bug in errorMap type - it should be a function return type, but it is a function itself
                    // Their builds works because of casting to never
                    // https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2125
                    onSubmit: errors as any,
                })
                onError?.({ target: "root", errors })
            }

            for (const id of Object.values(InputFields)) {
                const errors = getAuthErrorsFromUiTextList(inputNodeMessages(getNodeById(response.ui.nodes, id)))

                if (errors.length > 0) {
                    formApi.setFieldMeta(id, meta => {
                        return {
                            ...meta,
                            errorMap: {
                                onSubmit: errors,
                            },
                        }
                    })
                    onError?.({ target: id, errors })
                }
            }
        },
    })
}
