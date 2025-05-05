import { useForm } from "@tanstack/react-form"
import { instanceOfSuccessfulNativeLogin } from "../../../kratos"
import {
    getAuthErrorsFromUiTextList,
    getCsrfToken,
    getNodeById,
    inputNodeAttributes,
    inputNodeMessages,
} from "../../../utils"
import { useGetLoginFlow } from "../hooks"
import { useUpdateLoginFlow } from "../hooks/useUpdateLoginFlow"
import { OnLoginFlowError } from "../types"
import { InputFields } from "./types"

type UseCodeFormProps = {
    onError?: OnLoginFlowError
}

export function useCodeForm({ onError }: UseCodeFormProps) {
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
