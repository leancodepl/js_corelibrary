import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { FieldValidateFn } from "@tanstack/react-form"
import {
    AdditionalValidationError,
    CommonInputFieldProps,
    getAuthErrorsFromFormErrorMap,
    mapAdditionalValidationErrorToAuthError,
} from "../../../../utils"
import { useChooseMethodFormContext } from "../chooseMethodFormContext"
import { InputFields } from "../types"

type PasswordConfirmationProps = {
    children: ReactNode
}

const validatorHandler: FieldValidateFn<
    {
        [InputFields.Password]: string
        [InputFields.PasswordConfirmation]: string
    },
    "password_confirmation",
    string
> = ({ value, fieldApi }) => {
    const meta = fieldApi.form.getFieldMeta(InputFields.PasswordConfirmation)

    if (meta?.isDirty && meta?.isTouched) {
        return getPasswordConfirmationErrors(value, fieldApi.form.getFieldValue(InputFields.Password))
    }

    return undefined
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
    const { chooseMethodForm } = useChooseMethodFormContext()

    const Comp: ComponentType<CommonInputFieldProps> = Slot.Root

    return (
        <chooseMethodForm.Field
            listeners={{
                onChange: ({ fieldApi }) => {
                    fieldApi.form.setFieldMeta(InputFields.PasswordConfirmation, meta => ({
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
                onChangeListenTo: [InputFields.Password],
                onChange: validatorHandler,
                onBlurListenTo: [InputFields.PasswordConfirmation],
                onBlur: validatorHandler,
                onSubmit: ({ value, fieldApi }) =>
                    getPasswordConfirmationErrors(value, fieldApi.form.getFieldValue(InputFields.Password)),
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
        </chooseMethodForm.Field>
    )
}
