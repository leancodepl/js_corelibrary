import { useForm } from "@tanstack/react-form"
import { useLoginFlowContext } from ".."
import { instanceOfSuccessfulNativeLogin } from "../../../kratos"
import { handleOnSubmitErrors } from "../../../utils"
import { getCsrfToken } from "../../../utils/flow"
import { useGetLoginFlow } from "../hooks"
import { useUpdateLoginFlow } from "../hooks/useUpdateLoginFlow"
import { OnLoginFlowError } from "../types"
import { InputFields } from "./types"

type UsePasswordFormProps = {
    onError?: OnLoginFlowError
}

export function usePasswordForm({ onError }: UsePasswordFormProps) {
    const { setVerifiableAddress } = useLoginFlowContext()
    const { mutateAsync: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()

    return useForm({
        defaultValues: {
            [InputFields.Identifier]: "",
            [InputFields.Password]: "",
        } satisfies Record<InputFields, string>,
        onSubmit: async ({ value, formApi }) => {
            if (!loginFlow) return

            const response = await updateLoginFlow({
                csrf_token: getCsrfToken(loginFlow),
                method: "password",
                identifier: value[InputFields.Identifier],
                password: value[InputFields.Password],
            })

            if (!response) {
                return
            }

            if (instanceOfSuccessfulNativeLogin(response)) {
                return
            }

            // AddressNotVerified
            if (response.ui.messages?.some(({ id }) => id === 4000010)) {
                setVerifiableAddress(value[InputFields.Identifier])
            }

            handleOnSubmitErrors(response, formApi, onError)
        },
    })
}
