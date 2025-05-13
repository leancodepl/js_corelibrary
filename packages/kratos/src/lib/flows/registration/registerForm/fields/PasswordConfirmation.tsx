import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import {
    AdditionalValidationError,
    CommonInputFieldProps,
    getAuthErrorsFromFormErrorMap,
    mapAdditionalValidationErrorToAuthError,
} from "../../../../utils"
import { useRegisterFormContext } from "../registerFormContext"

type PasswordConfirmationProps = {
    children: ReactNode
}

export const getPasswordConfirmationErrors = (confirmationValue: string, passwordValue: string) => {
    if (!confirmationValue) {
        return [mapAdditionalValidationErrorToAuthError(AdditionalValidationError.FieldRequired)]
    }
    if (confirmationValue !== passwordValue) {
        return [mapAdditionalValidationErrorToAuthError(AdditionalValidationError.FieldMismatch)]
    }
    return undefined
}

export function PasswordConfirmation({ children }: PasswordConfirmationProps) {
    const { passwordForm } = useRegisterFormContext()

    const Comp: ComponentType<CommonInputFieldProps> = Slot.Root

    return (
        <passwordForm.Field
            listeners={{
                onChange: ({ fieldApi }) => {
                    fieldApi.form.setFieldMeta("password_confirmation", meta => ({
                        ...meta,
                        errorMap: {
                            ...meta.errorMap,
                            onSubmit: undefined,
                        },
                    }))
                },
            }}
            name="password_confirmation"
            validators={{
                onChangeListenTo: ["password"],
                onChange: ({ value, fieldApi }) => {
                    const meta = fieldApi.form.getFieldMeta("password_confirmation")

                    if (meta?.isDirty && meta?.isTouched) {
                        return getPasswordConfirmationErrors(value, fieldApi.form.getFieldValue("password"))
                    }

                    return undefined
                },
                onBlurListenTo: ["password_confirmation"],
                onBlur: ({ value, fieldApi }) => {
                    const meta = fieldApi.form.getFieldMeta("password_confirmation")

                    if (meta?.isDirty && meta?.isTouched) {
                        return getPasswordConfirmationErrors(value, fieldApi.form.getFieldValue("password"))
                    }

                    return undefined
                },
                onSubmit: ({ value, fieldApi }) =>
                    getPasswordConfirmationErrors(value, fieldApi.form.getFieldValue("password")),
            }}>
            {field => (
                <Comp
                    errors={getAuthErrorsFromFormErrorMap(field.state.meta.errorMap)}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}>
                    {children}
                </Comp>
            )}
        </passwordForm.Field>
    )
}
