import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps, getAuthErrorsFromFormErrorMap } from "../../../../utils"
import { useNewPasswordFormContext } from "../newPasswordFormContext"

type PasswordProps = {
    children: ReactNode
}

export function Password({ children }: PasswordProps) {
    const { newPasswordForm } = useNewPasswordFormContext()

    const Comp: ComponentType<CommonInputFieldProps> = Slot.Root

    return (
        <newPasswordForm.Field name="password">
            {field => (
                <Comp
                    errors={getAuthErrorsFromFormErrorMap(field.state.meta.errorMap)}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}>
                    {children}
                </Comp>
            )}
        </newPasswordForm.Field>
    )
}
