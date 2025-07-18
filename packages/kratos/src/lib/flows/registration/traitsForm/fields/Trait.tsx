import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import {
    CommonCheckboxFieldProps,
    CommonInputFieldProps,
    getAuthErrorsFromFormErrorMap,
    traitPrefix,
    TraitValue,
} from "../../../../utils"
import { useTraitsFormContext } from "../traitsFormContext"

type TraitProps<TTrait extends string> = {
    children: ReactNode
    trait: TTrait
}

export function TraitInput<TTrait extends string>({ trait, children }: TraitProps<TTrait>) {
    const { traitsForm } = useTraitsFormContext()

    const Comp: ComponentType<CommonInputFieldProps> = Slot.Root

    return (
        <traitsForm.Field name={`${traitPrefix}${trait}`}>
            {field => {
                if (typeof field.state.value !== "string") {
                    throw new Error("TraitInput: value is not string")
                }

                return (
                    <Comp
                        errors={getAuthErrorsFromFormErrorMap(field.state.meta.errorMap)}
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value as TraitValue<TTrait>)}>
                        {children}
                    </Comp>
                )
            }}
        </traitsForm.Field>
    )
}

export function TraitCheckbox<TTrait extends string>({ trait, children }: TraitProps<TTrait>) {
    const { traitsForm } = useTraitsFormContext()

    const Comp: ComponentType<CommonCheckboxFieldProps> = Slot.Root

    return (
        <traitsForm.Field name={`${traitPrefix}${trait}`}>
            {field => {
                if (typeof field.state.value !== "boolean") {
                    throw new Error("TraitCheckbox: value is not boolean")
                }

                return (
                    <Comp
                        checked={field.state.value}
                        errors={getAuthErrorsFromFormErrorMap(field.state.meta.errorMap)}
                        name={field.name}
                        type="checkbox"
                        onChange={e => field.handleChange(e.target.checked as TraitValue<TTrait>)}>
                        {children}
                    </Comp>
                )
            }}
        </traitsForm.Field>
    )
}
