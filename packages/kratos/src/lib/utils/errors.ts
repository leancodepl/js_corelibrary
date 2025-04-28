import { instanceOfUiText, UiText, UiTextTypeEnum } from "../kratos/models"

export type FormError = UiText & {
    type: typeof UiTextTypeEnum.Error
}

export const isFormError = (error: unknown): error is FormError => {
    if (typeof error !== "object" || error === null) {
        return false
    }
    if (!instanceOfUiText(error)) {
        return false
    }
    if (error.type !== UiTextTypeEnum.Error) {
        return false
    }
    return true
}

export const getErrorsFromUiTextList = (messages: UiText[] | undefined): Array<FormError> => {
    return messages?.filter(message => isFormError(message)) ?? []
}

export const getErrorsFromErrorMap = ({ onSubmit: errors }: { onSubmit?: unknown } = {}): Array<FormError> => {
    if (!errors) {
        return []
    }

    if (typeof errors === "string") {
        return [{ id: -1, text: errors, type: UiTextTypeEnum.Error }]
    }

    if (!Array.isArray(errors) || errors.length === 0) {
        return []
    }

    return errors
        .map(error => {
            if (typeof error === "string") {
                return { id: -1, text: error, type: UiTextTypeEnum.Error }
            }

            if (isFormError(error)) {
                return error
            }

            return undefined
        })
        .filter(error => error !== undefined)
}
