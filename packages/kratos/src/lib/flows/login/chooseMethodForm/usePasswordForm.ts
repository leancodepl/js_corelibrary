import { useForm } from "@tanstack/react-form"
import { instanceOfSuccessfulNativeLogin } from "../../../kratos"
import { getAuthErrorsFromUiTextList } from "../../../utils"
import { getCsrfToken, getNodeById, inputNodeMessages } from "../../../utils/flow"
import { useGetLoginFlow } from "../hooks"
import { useUpdateLoginFlow } from "../hooks/useUpdateLoginFlow"
import { OnLoginFlowError } from "../types"
import { InputFields } from "./types"

type UsePasswordFormProps = {
    onError?: OnLoginFlowError
}

export function usePasswordForm({ onError }: UsePasswordFormProps) {
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
