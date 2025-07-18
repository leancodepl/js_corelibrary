import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonInputFieldProps, getAuthErrorsFromFormErrorMap } from "../../../../utils"
import { useChooseMethodFormContext } from "../chooseMethodFormContext"

type IdentifierProps = {
    children: ReactNode
}

export function Identifier({ children }: IdentifierProps) {
    const { passwordForm } = useChooseMethodFormContext()

    const Comp: ComponentType<CommonInputFieldProps> = Slot.Root

    return (
        <passwordForm.Field name="identifier">
            {field => (
                <Comp
                    errors={getAuthErrorsFromFormErrorMap(field.state.meta.errorMap)}
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
