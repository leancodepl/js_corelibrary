import { useForm } from "@tanstack/react-form"
import { instanceOfSuccessfulNativeRegistration } from "../../../kratos"
import { getAuthErrorsFromUiTextList } from "../../../utils"
import { getCsrfToken, getNodeById, inputNodeMessages } from "../../../utils/flow"
import { useGetRegistrationFlow } from "../hooks"
import { useUpdateRegistrationFlow } from "../hooks/useUpdateRegistrationFlow"
import { OnRegistrationFlowError, TraitsConfig } from "../types"
import { InputFields } from "./types"

type UsePasswordFormProps<TTraitsConfig extends TraitsConfig> = {
    traitsConfig: TTraitsConfig
    onError?: OnRegistrationFlowError
    onRegisterationSuccess?: () => void
}

export function usePasswordForm<TTraitsConfig extends TraitsConfig>({
    traitsConfig,
    onError,
    onRegisterationSuccess,
}: UsePasswordFormProps<TTraitsConfig>) {
    const { mutateAsync: updateRegistrationFlow } = useUpdateRegistrationFlow()
    const { data: registrationFlow } = useGetRegistrationFlow()

    return useForm({
        defaultValues: {
            [InputFields.Password]: "",
            [InputFields.PasswordConfirmation]: "",
            traits: Object.fromEntries(
                Object.values(traitsConfig).map(({ trait, type }) => [trait, type === "boolean" ? false : ""]),
            ),
        },
        onSubmit: async ({ value, formApi }) => {
            if (!registrationFlow) return

            const response = await updateRegistrationFlow({
                csrf_token: getCsrfToken(registrationFlow),
                method: "password",
                traits: value.traits ?? {},
                password: value[InputFields.Password],
            })

            if (!response) {
                return
            }

            if (instanceOfSuccessfulNativeRegistration(response)) {
                onRegisterationSuccess?.()
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

            for (const idString in formApi.fieldInfo) {
                const id = idString as Exclude<keyof typeof formApi.fieldInfo, "traits">
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
