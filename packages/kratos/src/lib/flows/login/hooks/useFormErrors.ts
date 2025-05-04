import { useMemo } from "react"
import { ReactFormExtendedApi } from "@tanstack/react-form"
import { getAuthErrorsFromFormErrorMap } from "../../../utils"

export function useFormErrors<T extends ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>>(
    form: T,
) {
    const formErrors = useMemo(() => getAuthErrorsFromFormErrorMap(form.state.errorMap), [form.state.errorMap])

    return formErrors
}
