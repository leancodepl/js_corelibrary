import { useForm } from "@tanstack/react-form"
import { instanceOfSuccessfulNativeLogin } from "../../../kratos"
import { getCsrfToken, getNodeById, handleOnSubmitErrors, inputNodeAttributes } from "../../../utils"
import { useGetLoginFlow, useUpdateLoginFlow } from "../hooks"
import { OnLoginFlowError } from "../types"
import { InputFields } from "./types"

type UseCodeFormProps = {
    onError?: OnLoginFlowError
    onLoginSuccess?: () => void
}

export function useCodeForm({ onError, onLoginSuccess }: UseCodeFormProps) {
    const { mutateAsync: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()

    return useForm({
        defaultValues: { [InputFields.Code]: "" } satisfies Record<InputFields, string>,
        onSubmit: async ({ value, formApi }) => {
            if (!loginFlow) return

            const identifier = inputNodeAttributes(getNodeById(loginFlow.ui.nodes, "identifier"))?.value

            const response = await updateLoginFlow({
                csrf_token: getCsrfToken(loginFlow),
                method: "code",
                code: value.code,
                identifier,
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
