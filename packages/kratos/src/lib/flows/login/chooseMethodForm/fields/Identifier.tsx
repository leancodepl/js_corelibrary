import { ComponentType } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps, getErrorsFromErrorMap } from "../../../../utils"
import { useChooseMethodFormContext } from "../chooseMethodFormContext"

type IdentifierProps = {
    children: React.ReactNode
}

export function Identifier({ children }: IdentifierProps) {
    const { passwordForm } = useChooseMethodFormContext()

    const Comp: ComponentType<CommonInputFieldProps> = Slot.Root

    return (
        <passwordForm.Field name="identifier">
            {field => (
                <Comp
                    errors={getErrorsFromErrorMap(field.state.meta.errorMap)}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}>
                    {children}
                </Comp>
            )}
        </passwordForm.Field>
    )
}
