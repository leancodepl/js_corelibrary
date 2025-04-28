import { useForm } from "@tanstack/react-form"
import { instanceOfSuccessfulNativeLogin } from "../../../kratos"
import { getErrorsFromUiTextList } from "../../../utils"
import { getCsrfToken, getNodeById, inputNodeMessages } from "../../../utils/flow"
import { useGetLoginFlow } from "../hooks"
import { useUpdateLoginFlow } from "../hooks/useUpdateLoginFlow"

enum InputFields {
    Identifier = "identifier",
    Password = "password",
}

export function usePasswordForm() {
    const { mutateAsync: updateLoginFlow } = useUpdateLoginFlow()
    const { data: loginFlow } = useGetLoginFlow()

    return useForm({
        defaultValues: { [InputFields.Identifier]: "", [InputFields.Password]: "" },
        onSubmit: async form => {
            const { value, formApi } = form

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

            const errors = getErrorsFromUiTextList(response.ui.messages)

            if (errors.length > 0) {
                formApi.setErrorMap({
                    onSubmit: errors, // TODO typescript error - customize form to accept FormError[] as valid value
                })
            }

            Object.values(InputFields).forEach(id => {
                const errors = getErrorsFromUiTextList(inputNodeMessages(getNodeById(response.ui.nodes, id)))

                if (errors.length > 0) {
                    formApi.setFieldMeta(id, meta => {
                        return {
                            ...meta,
                            errorMap: {
                                onSubmit: errors,
                            },
                        }
                    })
                }
            })
        },
    })
}
