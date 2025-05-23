import { DeepKeys, FormApi, FormAsyncValidateOrFn, FormValidateOrFn } from "@tanstack/react-form"
import { LoginFlow, RegistrationFlow, VerificationFlow } from "../kratos"
import { AuthError, getAuthErrorsFromUiTextList } from "./errors"
import { getNodeById, inputNodeMessages } from "./flow"

export type OnFlowError<TFlowErrors extends string = string> = (props: {
    target: "root" | TFlowErrors
    errors: AuthError[]
}) => Promise<void> | void

export type FlattenObjectKeys<T extends Record<string, unknown>, Key = keyof T> = Key extends string
    ? T[Key] extends Record<string, unknown>
        ? `${Key}.${FlattenObjectKeys<T[Key]>}`
        : `${Key}`
    : never

export const handleOnSubmitErrors = <
    TFields extends Record<string, unknown>,
    TResponse extends LoginFlow | RegistrationFlow | VerificationFlow,
>(
    response: TResponse,
    formApi: FormApi<
        TFields,
        FormValidateOrFn<TFields> | undefined,
        FormValidateOrFn<TFields> | undefined,
        FormAsyncValidateOrFn<TFields> | undefined,
        FormValidateOrFn<TFields> | undefined,
        FormAsyncValidateOrFn<TFields> | undefined,
        FormValidateOrFn<TFields> | undefined,
        FormAsyncValidateOrFn<TFields> | undefined,
        FormAsyncValidateOrFn<TFields> | undefined,
        unknown
    >,
    onError?: OnFlowError<Extract<DeepKeys<TFields>, FlattenObjectKeys<TFields>>>,
) => {
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
        const id = idString as Extract<DeepKeys<TFields>, FlattenObjectKeys<TFields>>
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
}
