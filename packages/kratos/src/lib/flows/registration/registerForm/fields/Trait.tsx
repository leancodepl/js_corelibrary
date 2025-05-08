import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonCheckboxFieldProps, CommonInputFieldProps, getAuthErrorsFromFormErrorMap } from "../../../../utils"
import { useRegisterFormContext } from "../registerFormContext"

type TraitProps<TTrait extends string> = {
    children: ReactNode
    trait: TTrait
}

export function TraitInput<TTrait extends string>({ trait, children }: TraitProps<TTrait>) {
    const { passwordForm } = useRegisterFormContext()

    const Comp: ComponentType<CommonInputFieldProps> = Slot.Root

    return (
        <passwordForm.Field name={`traits.${trait}`}>
            {field => {
                if (typeof field.state.value === "boolean") {
                    throw new Error("TraitInput: value cannot be boolean")
                }

                return (
                    <Comp
                        errors={getAuthErrorsFromFormErrorMap(field.state.meta.errorMap)}
                        name={field.name}
                        type="text"
                        onChange={e => field.handleChange(e.target.value)}>
                        {children}
                    </Comp>
                )
            }}
        </passwordForm.Field>
    )
}

export function TraitCheckbox<TTrait extends string>({ trait, children }: TraitProps<TTrait>) {
    const { passwordForm } = useRegisterFormContext()

    const Comp: ComponentType<CommonCheckboxFieldProps> = Slot.Root

    return (
        <passwordForm.Field name={`traits.${trait}`}>
            {field => {
                if (typeof field.state.value === "string") {
                    throw new Error("TraitCheckbox: value is not boolean")
                }

                return (
                    <Comp
                        checked={field.state.value}
                        errors={getAuthErrorsFromFormErrorMap(field.state.meta.errorMap)}
                        name={field.name}
                        type="checkbox"
                        onChange={e => field.handleChange(e.target.checked)}>
                        {children}
                    </Comp>
                )
            }}
        </passwordForm.Field>
    )
}
