import { useMemo } from "react"
import { FormApi, FormAsyncValidateOrFn, FormValidateOrFn } from "@tanstack/react-form"
import { getAuthErrorsFromFormErrorMap } from "../utils"

export function useFormErrors<TFields extends Record<string, unknown>>(
  form: FormApi<
    TFields,
    FormValidateOrFn<TFields> | undefined,
    FormValidateOrFn<TFields> | undefined,
    FormAsyncValidateOrFn<TFields> | undefined,
    FormValidateOrFn<TFields> | undefined,
    FormAsyncValidateOrFn<TFields> | undefined,
    FormValidateOrFn<TFields> | undefined,
    FormAsyncValidateOrFn<TFields> | undefined,
    FormValidateOrFn<TFields> | undefined,
    FormAsyncValidateOrFn<TFields> | undefined,
    FormAsyncValidateOrFn<TFields> | undefined,
    unknown
  >,
) {
  return useMemo(() => getAuthErrorsFromFormErrorMap(form.state.errorMap), [form.state.errorMap])
}
